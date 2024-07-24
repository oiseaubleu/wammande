class Supplier < ApplicationRecord
  has_many :order_records
  has_many :supplier_purchases
  has_many :purchases, through: :supplier_purchases

  # presence validation
  validates :name, presence: true
  validates :cycle_value, presence: true
  validates :cycle_unit, presence: true
  validates :how_to_order, presence: true

  #enum
  enum cycle_unit: %i[daily weekly monthly yearly]
  enum how_to_order: %i[phone email online direct]

end
