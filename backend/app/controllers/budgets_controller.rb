class BudgetsController < ApplicationController
  # before_action :set_admin, only: %i[show edit update destroy]
  #before_action :correct_admin # , only: %i[show edit update destroy]
  before_action :set_budget, only: %i[update destroy]
  # skip_before_action :login_required, only: %i[new create]
  skip_before_action :verify_authenticity_token##後で消す
  # 予算額一覧の表示
  def index
    @budgets = Budget.all
    render json: @budgets
  end


  # 予算額の新規登録
  def create
    
    @budget = Budget.new(budget_params)
    @budget.user_id =  14 ##後でcurrent_userに修正
    #binding.irb

    if @budget.save
      render json: @budget, status: :created #201
    else
      render json: @budget.errors, status: :unprocessable_entity #422
    end
  end


  # 予算額情報更新
  def update
    if @budget.update(budget_params)
      render json: @budget
    else
      render json: @budget.errors, status: :unprocessable_entity
    end
  end

  #予算額削除
  def destroy
    @budget.destroy
    head :ok
  end

  # # 予算残額
  # def calculate_balance
  #   @budget.purchase_budget-うわどうしよう
  # end

  
  ############################
  private

  def set_budget
    @budget = Budget.find(params[:id])
  end

  def budget_params
    params.require(:budget).permit(:year, :month, :purchase_budget, :alert_threshold, :comment)
  end


end
