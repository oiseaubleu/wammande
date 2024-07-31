class OrderDetail < ApplicationRecord
  belongs_to :order_record
  belongs_to :supplier_purchase

   # presence validation
   validates :quantity, presence: true
   validates :subtotal_amount, presence: true
   validates :order_status, presence: true

   #enum
   enum order_status: {
    not_ordered: 0,              # 未発注
    ordered_pending_delivery: 1, # 発注済（納品待ち）
    order_cancelled: 2,          # 発注キャンセル
    delivered: 3,                # 納品済
    delivery_cancelled: 4        # 納品キャンセル
    }

end
