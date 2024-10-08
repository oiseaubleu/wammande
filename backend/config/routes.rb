Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  get 'budgets/remaining', to: 'budgets#remaining'
  resources :budgets

  get 'orders/todo', to: 'orders#todo'
  resources :orders
  resources :order_records
  resources :purchases
  resources :supplier_purchases
  resources :suppliers
  resources :users
end
