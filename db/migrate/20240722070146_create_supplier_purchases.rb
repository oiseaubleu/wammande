class CreateSupplierPurchases < ActiveRecord::Migration[6.1]
  def change
    create_table :supplier_purchases do |t|
      t.references :supplier, null: false, foreign_key: true
      t.references :purchase, null: false, foreign_key: true
      t.decimal :price, null: false
      t.bigint :version, null: false
      t.bigint :purchase_count, default: 0, null: false
      t.text :comment
      t.datetime :next_purchase_day, null: false

      t.timestamps
    end
  end
end
