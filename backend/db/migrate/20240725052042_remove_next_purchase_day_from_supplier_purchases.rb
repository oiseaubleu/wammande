class RemoveNextPurchaseDayFromSupplierPurchases < ActiveRecord::Migration[6.1]
  def change
    remove_column :supplier_purchases, :next_purchase_day, :datetime
  end
end
