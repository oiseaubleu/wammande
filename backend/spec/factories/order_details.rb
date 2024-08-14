FactoryBot.define do
  factory :order_detail do
    association :order_record
    association :supplier_purchase
    quantity { 10 }
    subtotal_amount { 100.0 }
    order_status { :not_ordered }
  end
end
