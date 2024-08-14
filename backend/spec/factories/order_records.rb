FactoryBot.define do
  factory :order_record do
    association :supplier
    association :user
    order_status { :not_ordered }
    total_amount { 100.0 }
    order_date { '2021-01-01' }
  end
end
