# frozen_string_literal: true

require 'net/http'
require 'uri'
require 'json'

require 'jwt'

# 渡されたアクセストークンを検証するクラス
class TokenVerifier
  @jwks_cache = nil
  @jwks_cache_timestamp = nil
  @jwks_cache_ttl = 60 * 60 # 1 hour

  def initialize(access_token)
    @access_token = access_token
    @cognito_user_pool_id = ENV['COGNITO_USER_POOL_ID']
    @cognito_region = ENV['COGNITO_REGION']
    @cognito_url_base = "https://cognito-idp.#{@cognito_region}.amazonaws.com/#{@cognito_user_pool_id}"
  end

  # アクセストークンを検証する
  # jwksを取得して1時間くらいキャッシュでもってる
  # jwksを使ってjwtを検証する⇒検証に成功したらデコードされたトークンを返す
  def verify
    jwks = fetch_jwks
    decoded_token = decode_jwt(@access_token, jwks)
    validate_claims(decoded_token)

    decoded_token
  rescue JWT::DecodeError => e
    puts "JWT::DecodeError: #{e.message}"
    nil
  end

  private

  def fetch_jwks
    # キャッシュがないか、キャッシュが期限切れの場合は取得
    if @jwks_cache_timestamp.nil? || cache_expired?
      uri = URI.parse("#{@cognito_url_base}/.well-known/jwks.json")
      response = Net::HTTP.get_response(uri)
      raise "Failed to fetch JWKS #{response.message}" unless response.is_a?(Net::HTTPSuccess)

      @jwks_cache = JSON.parse(response.body)
      @jwks_cache_timestamp = Time.now

    end

    @jwks_cache
  end

  def cache_expired?
    @jwks_cache_timestamp.nil? || Time.now - @jwks_cache_timestamp > @jwks_cache_ttl
  end

  def decode_jwt(token, jwks)
    # JWT（ライブラリ）でデコードして検証してる⇒公開鍵を使う⇒デコードしないと公開鍵わかんないので取得
    # 引数5つ：jwtトークン、署名の検証に使う公開鍵（正しい証明書を取得するのを事前に取得するのが難しいのでとりあえずnil）、検証するかしないか、検証につかうアルゴリズムと、
    # doからendまでのブロックでヘッダーからキーIDを取得して、そのキーIDに対応する公開鍵を作ってる
    payload, = JWT.decode(token, nil, true, { algorithm: 'RS256' }) do |header|
      jwk_hash = jwks['keys'].find { |jwk| jwk['kid'] == header['kid'] }
      jwk = JWT::JWK.new(jwk_hash)
      jwk.public_key
    end

    payload
  rescue JWT::DecodeError => e
    puts "JWT::DecodeError: #{e.message} / token: #{token}"
  end

  # デコードしたトークンの中身を検証する
  def validate_claims(decoded_token)
    raise 'Invalid token' unless decoded_token['token_use'] == 'access'
    raise 'Invalid token' unless decoded_token['iss'] == @cognito_url_base
    raise 'Token is expired' if Time.now.to_i > decoded_token['exp'] # いらないかも？
  end
end
