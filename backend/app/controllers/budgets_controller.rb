class BudgetsController < ApplicationController
  # before_action :set_admin, only: %i[show edit update destroy]
  # before_action :correct_admin # , only: %i[show edit update destroy]
  before_action :set_budget, only: %i[update destroy]
  # skip_before_action :login_required, only: %i[new create]
  skip_before_action :verify_authenticity_token # #後で消す
  # 予算額一覧の表示
  def index
    @budgets = Budget.all
    render json: @budgets
  end

  # 予算額の新規登録
  def create
    @budget = Budget.new(budget_params)
    @budget.user_id = 1 # #後でcurrent_userに修正
    # binding.irb

    if @budget.save
      render json: @budget, status: :created # 201
    else
      render json: @budget.errors, status: :unprocessable_entity # 422
    end
  end

  # 予算額情報更新
  def update
    if @budget.update(budget_params)
      @budget.user_id = 1 # #後でcurrent_userに修正
      render json: @budget
    else
      render json: @budget.errors, status: :unprocessable_entity
    end
  end

  # 予算額削除
  def destroy
    @budget.user_id = 1 # #後でcurrent_userに修正
    @budget.destroy
    head :ok
  end

  # 予算残額と表示
  # 現在の月の最初の日と最後の日を取得し、その月に発生した全ての注文の合計金額 (total_amount) を計算
  # 予算額から合計金額を引いた残額を計算し、JSON形式で返す
  def remaining
    start_date = Date.current.beginning_of_month
    end_date = Date.current.end_of_month
    current_year = Date.current.year
    current_month = Date.current.month

    total_amount = OrderRecord.where(order_date: start_date..end_date).sum(:total_amount)
    # 現在の年と月に一致する予算を取得
    budget = Budget.find_by(year: current_year, month: current_month)
    # 予算が存在する場合に remaining_budget を計算

    if budget
      remaining_budget = budget.purchase_budget - total_amount
      alert_threshold = budget.alert_threshold
    else
      remaining_budget = 0 - total_amount
      alert_threshold = 0
    end

    display_message = if remaining_budget <= 0
                        'over budget'
                      elsif remaining_budget <= alert_threshold
                        'warning'
                      else
                        'none'
                      end

    render json: { remaining_budget:, display_message: }
  end

  ############################

  private

  def set_budget
    @budget = Budget.find(params[:id])
  end

  def budget_params
    params.require(:budget).permit(:year, :month, :purchase_budget, :alert_threshold, :comment)
  end
end
