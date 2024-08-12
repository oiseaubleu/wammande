class UsersController < ApplicationController
  # before_action :set_admin, only: %i[show edit update destroy]
  # before_action :correct_admin # , only: %i[show edit update destroy]
  before_action :set_user, only: %i[update destroy show]
  # skip_before_action :login_required, only: %i[new create]
  skip_before_action :verify_authenticity_token # #後で消す

  # ユーザ一覧の表示
  def index
    @users = User.all
    render json: @users
  end

  def show
    render json: @user
  end

  # ユーザの新規登録
  def create
    @user = User.new(user_params)

    # ひとまずナイーブに
    client = Aws::CognitoIdentityProvider::Client.new(region: 'ap-northeast-1')
    resp = client.admin_create_user(
      user_pool_id: ENV['COGNITO_USER_POOL_ID'],
      desired_delivery_mediums: ['EMAIL'],
      temporary_password: SecureRandom.alphanumeric + '1A!',
      username: @user.email.split('@').first,
      user_attributes: [
        { name: 'name', value: @user.name },
        { name: 'email', value: @user.email },
        { name: 'email_verified', value: 'true' }
      ]
    )
    if resp.user.attributes.find { |attr| attr.name == 'sub' }
      @user.subject = resp.user.attributes.find { |attr| attr.name == 'sub' }.value
      @user.cognito_status = 'confirmed'
    end

    if @user.save
      render json: @user, status: :created # 201
    else
      render json: @user.errors, status: :unprocessable_entity # 422
    end
  end

  # ユーザ情報更新
  def update
    if @user.update(user_params)
      render json: @user
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  # ユーザ削除
  def destroy
    @user.destroy
    head :ok
  end

  ############################
  private

  def set_user
    @user = User.find(params[:id])
  end

  def user_params
    params.require(:user).permit(:name, :email, :password, :password_confirmation, :admin)
  end

  # def correct_admin
  #   # redirect_to current_user unless current_user?(@user)
  #   # if current_user.admin?
  #   #   @user = User.find(params[:id])
  #   # else
  #   # binding.irb
  #   return if current_user.admin?

  #   flash[:danger] = '管理者以外アクセスできません'
  #   redirect_to tasks_path # (current_user.id)
  # end
end
