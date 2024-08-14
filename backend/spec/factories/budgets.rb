FactoryBot.define do
  factory :budget do
    association :user
    year { 2021 }
    month { 1 }
    purchase_budget { 1000.0 }
    alert_threshold { 500.0 }
  end
end
