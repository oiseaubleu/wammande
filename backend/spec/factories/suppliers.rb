# spec/factories/suppliers.rb
FactoryBot.define do
  factory :supplier do
    name { 'Supplier Name' }
    cycle_value { 1 }
    cycle_unit { :daily } # Choose a default that makes sense for most tests
    how_to_order { :online }
    next_purchase_day { Date.today + 1.month }
  end
end
