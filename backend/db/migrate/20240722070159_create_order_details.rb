class CreateOrderDetails < ActiveRecord::Migration[6.1]
  def change
    create_table :order_details do |t|
      t.references :order_record, null: false, foreign_key: true
      t.references :supplier_purchase, null: false, foreign_key: true
      t.decimal :quantity, null: false
      t.text :comment
      t.decimal :subtotal_amount, null: false
      t.integer :order_status, null: false

      t.timestamps
     # t.index :order_record_id

    end

   

  end
end
