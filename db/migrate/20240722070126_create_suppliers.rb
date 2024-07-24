class CreateSuppliers < ActiveRecord::Migration[6.1]
  def change
    create_table :suppliers do |t|
      t.string :name, null: false
      t.integer :cycle_value, null: false
      t.integer :cycle_unit, null: false
      t.integer :how_to_order, null: false

      t.timestamps
    end
  end
end
