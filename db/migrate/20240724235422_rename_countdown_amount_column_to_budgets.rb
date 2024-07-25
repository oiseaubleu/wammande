class RenameCountdownAmountColumnToBudgets < ActiveRecord::Migration[6.1]
  def change
    rename_column :budgets, :countdown_amount, :alert_threshold
  end
end
