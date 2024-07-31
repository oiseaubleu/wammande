class AddCascadeDeleteToSupplierPurchases < ActiveRecord::Migration[6.1]
  def change
    remove_foreign_key :supplier_purchases, :suppliers
    add_foreign_key :supplier_purchases, :suppliers, on_delete: :cascade
  end
end
