class CreatePurchases < ActiveRecord::Migration[6.1]
  def change
    create_table :purchases do |t|
      t.string :name, null: false
      t.string :item_number
      t.boolean :is_food, default: true, null: false

      t.timestamps
    end
  end
end
