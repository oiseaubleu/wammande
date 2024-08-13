class OrderRecord < ApplicationRecord
  belongs_to :supplier
  belongs_to :user
  has_many :order_details

  accepts_nested_attributes_for :order_details, allow_destroy: true

  # presence validation
  validates :order_status, presence: true

  validates :total_amount, presence: true

  scope :search_order, lambda { |search_params|
                         search_by_supplier_name(search_params[:supplier_name])
                           .search_by_purchase_name(search_params[:purchase_name])
                           .search_by_order_date(search_params[:order_date])
                           .search_by_order_status(search_params[:status])
                       }

  # 仕入先名でのあいまい検索
  scope :search_by_supplier_name, lambda { |supplier_name|
                                    if supplier_name.present?
                                      joins(:supplier).where('suppliers.name like ?', "%#{supplier_name}%")
                                    end
                                  }

  # 仕入れ品名でのあいまい検索
  scope :search_by_purchase_name, lambda { |purchase_name|
    joins(order_details: { supplier_purchase: :purchase }).where('purchases.name like ?', "%#{purchase_name}%")
  }

  # 発注日での検索
  scope :search_by_order_date, lambda { |order_date|
    where(order_date:)
  }
  # 発注状態での検索
  scope :search_by_order_status, lambda { |status|
    where(order_status: status)
  }

  # enum
  enum order_status: {
    not_ordered: 0, # 未発注
    ordered_pending_delivery: 1, # 発注済（納品待ち）
    order_cancelled: 2,          # 発注キャンセル
    delivered: 3,                # 納品済
    delivery_cancelled: 4        # 納品キャンセル
  }
end
