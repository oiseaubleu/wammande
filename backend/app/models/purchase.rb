class Purchase < ApplicationRecord
  has_many :supplier_purchases
  has_many :suppliers, through: :supplier_purchases

  # presence validation
  validates :name, presence: true
  validates :is_food, inclusion: { in: [true, false] }
end
