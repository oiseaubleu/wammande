class Purchase < ApplicationRecord
  has_many :supplier_purchases
  has_many :suppliers, through: :supplier_purchases

  # presence validation
  validates :name, presence: true
  validates :is_food, inclusion: { in: [true, false] }

  # 仕入れ品名のあいまい検索
  scope :purchase_search, ->(name) { where('name like ?', "%#{name}%") if name.present? }
end
