class Supplier < ApplicationRecord
  has_many :order_records
  has_many :supplier_purchases
  has_many :purchases, through: :supplier_purchases

  accepts_nested_attributes_for :supplier_purchases, allow_destroy: true

  # presence validation
  validates :name, presence: true
  validates :cycle_value, presence: true
  validates :cycle_unit, presence: true
  validates :how_to_order, presence: true
  validates :next_purchase_day, presence: true

  # enum
  enum cycle_unit: %i[daily weekly monthly yearly]
  enum how_to_order: %i[application direct online email]

  def purchase_interval
    case cycle_unit
    when 'daily'
      cycle_value.days
    when 'weekly'
      cycle_value.weeks
    when 'monthly'
      cycle_value.months
    when 'yearly'
      cycle_value.years
    end
  end
end
