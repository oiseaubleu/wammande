class OrderRecord < ApplicationRecord
  belongs_to :supplier
  belongs_to :user
  has_many :order_details

  accepts_nested_attributes_for :order_details, allow_destroy: true

  # presence validation
  validates :order_status, presence: true

  validates :total_amount, presence: true

  # enum
  enum order_status: {
    not_ordered: 0, # 未発注
    ordered_pending_delivery: 1, # 発注済（納品待ち）
    order_cancelled: 2,          # 発注キャンセル
    delivered: 3,                # 納品済
    delivery_cancelled: 4        # 納品キャンセル
  }
end
