class SupplierPurchase < ApplicationRecord
  belongs_to :supplier
  belongs_to :purchase
  has_many :order_details

  # presence validation
  validates :price, presence: true, numericality: true
  validates :version, presence: true
  validates :purchase_count, presence: true
  validates :next_purchase_day, presence: true
end