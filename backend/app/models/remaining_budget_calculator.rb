# これだとたぶん、user_idが必要なので、user_idを引数に取るように変更する必要がある
# class RemainingBudgetCalculator
#   def initialize(user_id)
#     @user_id = user_id
#   end

#   def calculate(year, month)
#     Budget.joins("LEFT JOIN order_records ON budgets.user_id = order_records.user_id AND DATE_PART('year', order_records.order_date) = budgets.year AND DATE_PART('month', order_records.order_date) = budgets.month")
#           .select('budgets.year, budgets.month, budgets.purchase_budget AS total_budget, COALESCE(SUM(order_records.total_amount), 0) AS total_order_amount, budgets.purchase_budget - COALESCE(SUM(order_records.total_amount), 0) AS remaining_budget')
#           .where(budgets: { user_id: @user_id, year:, month: })
#           .group('budgets.year, budgets.month, budgets.purchase_budget')
#           .order('budgets.year, budgets.month')
#   end
# end
class RemainingBudgetCalculator
  def calculate
    Budget.joins("LEFT JOIN order_records ON budgets.user_id = order_records.user_id AND DATE_PART('year', order_records.order_date) = budgets.year AND DATE_PART('month', order_records.order_date) = budgets.month")
          .select('budgets.year, budgets.month, budgets.purchase_budget AS total_budget, COALESCE(SUM(order_records.total_amount), 0) AS total_order_amount, budgets.purchase_budget - COALESCE(SUM(order_records.total_amount), 0) AS remaining_budget')
          .group('budgets.year, budgets.month, budgets.purchase_budget')
          .order('budgets.year, budgets.month')
  end
end
