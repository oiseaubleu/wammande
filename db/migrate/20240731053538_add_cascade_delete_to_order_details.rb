class AddCascadeDeleteToOrderDetails < ActiveRecord::Migration[6.1]
  def change
    remove_foreign_key :order_details, :order_records
    add_foreign_key :order_details, :order_records, on_delete: :cascade
  end
end
