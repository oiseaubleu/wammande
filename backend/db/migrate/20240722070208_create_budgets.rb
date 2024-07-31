class CreateBudgets < ActiveRecord::Migration[6.1]
  def change
    create_table :budgets do |t|
      t.integer :year, null: false
      t.integer :month, null: false
      t.decimal :purchase_budget, null: false
      t.decimal :countdown_amount, null: false
      t.text :comment
      t.references :user, null: false, foreign_key: true

      t.timestamps
      #t.index :user_id

    end

    
  end
end
