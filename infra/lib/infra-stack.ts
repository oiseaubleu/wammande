import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecsp from 'aws-cdk-lib/aws-ecs-patterns';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as route53 from 'aws-cdk-lib/aws-route53';

interface InfraStackProps extends cdk.StackProps {
  environment: 'dev' | 'stg' | 'prd';
  githubRepos: string[];
  postgresConfig: {
    username: string;
  },
  hostedZoneId: string;
}

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: InfraStackProps) {
    super(scope, id, props);

    // ECR ... コンテナイメージを格納する場所
    const registry = new ecr.Repository(
      this, 'wammande-dev-repo', {
      repositoryName: 'wammande-dev-repo',
      imageScanOnPush: true,
      lifecycleRules: [{
        description: 'keep 10 images',
        maxImageCount: 10,
      }],
      // TODO: Change to RETAIN after everything is done
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    }
    );

    // GitHubからコンテナイメージをPushするための設定
    const identityProviderForGitHub = new iam.OpenIdConnectProvider(this, 'wammande-dev-github-provider', {
      url: 'https://token.actions.githubusercontent.com',
      clientIds: ['sts.amazonaws.com'],
    });
    const roleForGitHubActions = new iam.Role(this, 'wammande-dev-github-actions-role', {
      roleName: 'wammande-dev-github-actions-role',
      maxSessionDuration: cdk.Duration.hours(1),
      assumedBy: new iam.WebIdentityPrincipal(
        identityProviderForGitHub.openIdConnectProviderArn,
        {
          StringEquals: {
            'token.actions.githubusercontent.com:aud': 'sts.amazonaws.com',
          },
          StringLike: {
            'token.actions.githubusercontent.com:sub': props?.githubRepos.map(repo => `repo:${repo}:*`),
          }
        }
      ),
    });
    // ここでECRへのPush権限を与えてます
    registry.grantPush(roleForGitHubActions);

    // VPC ... ネットワークの設定
    const vpc = new ec2.Vpc(this, 'wammande-dev-vpc', {
      vpcName: 'wammande-dev-vpc',
      maxAzs: 2,
      ipAddresses: ec2.IpAddresses.cidr('172.16.0.0/20'),
      natGateways: 0,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'public',
          subnetType: ec2.SubnetType.PUBLIC,
          mapPublicIpOnLaunch: false,
        },
        {
          cidrMask: 24,
          name: 'private',
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        },
      ],
    });

    // RDS ... PostgreSQLのデータベースを作ってる
    const rdsInstance = new rds.DatabaseInstance(
      this,
      `wammande-${props.environment}-postgres`,
      {
        engine: rds.DatabaseInstanceEngine.postgres({
          version: rds.PostgresEngineVersion.VER_14,
        }),
        // t4g.micro
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE4_GRAVITON, ec2.InstanceSize.MICRO),
        vpc: vpc,
        vpcSubnets: {
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        },
        allocatedStorage: 10,
        maxAllocatedStorage: 20, // 無料枠の範囲内の20GBまでに絞っておく
        credentials: rds.Credentials.fromGeneratedSecret(
          props.postgresConfig.username,
          { secretName: `wammande-${props.environment}-postgresql-credentials` }
        ),
      }
    );

    // TODO: Cognito関連は後でCDK化しようかな…
    const userPool = cognito.UserPool.fromUserPoolId(
      this, 'wammande-dev-user-pool',
      'ap-northeast-1_bFGgI2NCK'
    );
    // const userPool = new cognito.UserPool(this, 'wammande-dev-user-pool', {
    //   userPoolName: 'wammande-dev-user-pool',
    // });
    // const appClient = userPool.addClient('wammande-dev-app-client', {

    // });

    // Route53 ... (サブ)ドメインの設定
    // 特に開発用の環境なんかは、ドメインを分けておくほうがよい
    const hostedZone = new route53.PublicHostedZone(this,
      `wammande-${props.environment}-hosted-zone`,
      {
        zoneName: `${props.environment}.wamman.de`,
      }
    )
    const rootHostedZone = route53.HostedZone.fromHostedZoneAttributes(this,
      'wammande-root-hosted-zone',
      {
        hostedZoneId: props.hostedZoneId,
        zoneName: 'wamman.de',
      }
    );
    const subdomainNsRecord = new route53.NsRecord(this,
      `wammande-${props.environment}-ns-record`,
      {
        zone: rootHostedZone,
        recordName: `${props.environment}.wamman.de`,
        ttl: cdk.Duration.minutes(5),
        values: hostedZone.hostedZoneNameServers || [],
      }
    );

    // ECS ... コンテナを動かすためのサービス
    const cluster = new ecs.Cluster(this, 'wammande-dev-cluster', {
      clusterName: `wammande-${props.environment}-cluster`,
      vpc,
    });
    cluster.addCapacity('wammande-dev-capacity', {
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.MICRO), // t3.micro
      allowAllOutbound: true,
      associatePublicIpAddress: true,
      desiredCapacity: 1,
      maxCapacity: 1,

      ssmSessionPermissions: true,
      vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
    });

    const ecsService = new ecsp.ApplicationLoadBalancedEc2Service(
      this,
      `wammande-${props.environment}-service`,
      {
        cluster,
        serviceName: `wammande-${props.environment}-service`,
        taskImageOptions: {
          image: ecs.ContainerImage.fromEcrRepository(registry), // tag: latest
          family: `wammande-${props.environment}-task`,
          containerName: 'app',
          containerPort: 3000,
          environment: {
            COGNITO_USER_POOL_ID: userPool.userPoolId,
            COGNITO_CLIENT_ID: '6l08m2jce5rthbjmcr8pie1vib',
            COGNITO_REGION: this.region,
            PURCHASE_MANAGEMENT_DATABASE_HOST: rdsInstance.dbInstanceEndpointAddress,
            PURCHASE_MANAGEMENT_DATABASE_PORT: rdsInstance.dbInstanceEndpointPort,
            PURCHASE_MANAGEMENT_DATABASE_USERNAME: props.postgresConfig.username,
            RAILS_ENV: 'development',
          },
          secrets: {
            PURCHASE_MANAGEMENT_DATABASE_PASSWORD: ecs.Secret.fromSecretsManager(rdsInstance.secret!, 'password')
          },
          // 起動するたびに db:create / db:migrate する。本当は必要なときだけ実行すべき
          command: ['/bin/sh', '-c', 'env && bundle exec rails db:create db:migrate && bundle exec rails s -p 3000 -b 0.0.0.0'],
        },

        // resources
        cpu: 256,
        memoryLimitMiB: 512,
        desiredCount: 1,

        // domain and alb
        domainName: `api.${props.environment}.wamman.de`,
        domainZone: hostedZone,
        protocol: elbv2.ApplicationProtocol.HTTPS,
        redirectHTTP: true,

        // tags
        enableECSManagedTags: true,
        propagateTags: ecs.PropagatedTagSource.TASK_DEFINITION,
      }
    );

    // ECS関連のRole
    const taskRole = ecsService.taskDefinition.taskRole;
    registry.grantPull(taskRole);
    userPool.grant(taskRole, 'cognito-idp:AdminCreateUser');
    rdsInstance.secret?.grantRead(taskRole);

    // ECS - RDSのセキュリティグループ
    rdsInstance.connections.allowFrom(cluster, ec2.Port.tcp(5432));
  }
}