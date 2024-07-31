class RemoveItemNumberFromPurchases < ActiveRecord::Migration[6.1]
  def change
    remove_column :purchases, :item_number, :string
  end
end
