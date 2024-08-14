class OrderRecord < ApplicationRecord
  belongs_to :supplier
  belongs_to :user
  has_many :order_details, dependent: :destroy

  accepts_nested_attributes_for :order_details, allow_destroy: true

  # presence validation
  validates :order_status, presence: true

  validates :total_amount, presence: true

  scope :search_order, lambda { |search_params|
                         query = all
                         if search_params[:supplier_name].present?
                           query = query.search_by_supplier_name(search_params[:supplier_name])
                         end
                         if search_params[:purchase_name].present?
                           query = query.search_by_purchase_name(search_params[:purchase_name])
                         end
                         if search_params[:order_date].present?
                           query = query.search_by_order_date(search_params[:order_date])
                         end
                         query = query.search_by_order_status(search_params[:status]) if search_params[:status].present?
                         query
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
  scope :search_by_order_date, lambda { |date|
                                 where(order_date: date) if date.present? && date.match(/\A\d{4}-\d{2}-\d{2}\z/)
                               }
  # scope :search_by_order_date, lambda { |date|
  #                                begin
  #                                  where(order_date: date) if Date.parse(date)
  #                                rescue StandardError
  #                                  nil
  #                                end
  #                              }

  # 発注状態での検索
  scope :search_by_order_status, lambda { |status|
                                   where(order_status: status.to_i)
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
