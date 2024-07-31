Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html

  resources :budgets
  resources :orders
  resources :order_records
  resources :purchases
  resources :supplier_purchases
  resources :suppliers
  resources :users
end
