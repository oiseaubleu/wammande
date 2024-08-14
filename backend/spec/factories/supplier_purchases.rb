FactoryBot.define do
  factory :supplier_purchase do
    association :supplier
    association :purchase
    price { 100.00 }
    version { 1 }
    purchase_count { 10 }
  end
end
