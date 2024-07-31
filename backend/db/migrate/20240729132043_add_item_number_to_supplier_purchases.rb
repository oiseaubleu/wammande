class AddItemNumberToSupplierPurchases < ActiveRecord::Migration[6.1]
  def change
    add_column :supplier_purchases, :item_number, :string
  end
end
