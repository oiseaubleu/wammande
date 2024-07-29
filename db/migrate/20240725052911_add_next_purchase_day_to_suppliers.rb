class AddNextPurchaseDayToSuppliers < ActiveRecord::Migration[6.1]
  def change
    add_column :suppliers, :next_purchase_day, :datetime, null: false,  default: -> { 'CURRENT_TIMESTAMP' }
  end
end
