module Authenticatable
  extend ActiveSupport::Concern
  ## Concernは、コントローラーに共通の処理を追加するための機能
  included do
    before_action :authenticate_user
  end

  private

  def authenticate_user
    token = request.headers['Authorization']&.split(' ')&.last
    if token.nil?
      render json: { error: 'Unauthorized', reason: 'Missing token' }, status: :unauthorized
      return
    end

    verifier = TokenVerifier.new(token)
    decoded_token = verifier.verify

    if decoded_token.nil?
      render json: { error: 'Unauthorized', reason: 'Invalid token' }, status: :unauthorized
      nil
    else
      @current_user = User.find_by(subject: decoded_token['sub'])
    end
  end
end
