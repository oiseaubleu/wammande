Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins '*' # フロントエンドのURL TODO: 本番用は変える必要あり
    resource '*',
             headers: :any,
             methods: %i[get post put patch delete options head]
  end
end
