class CreateOrderRecords < ActiveRecord::Migration[6.1]
  def change
    create_table :order_records do |t|
      t.references :supplier, null: false, foreign_key: true
      t.integer :order_status, null: false
      t.datetime :order_date
      t.datetime :delivery_date
      t.decimal :total_amount, null: false
      t.references :user, null: false, foreign_key: true

      t.timestamps
     # t.index :supplier_id
     # t.index :user_id
    end

 

  end
end
