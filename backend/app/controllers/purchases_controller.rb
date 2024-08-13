class PurchasesController < ApplicationController
  include Authenticatable
  # before_action :set_admin, only: %i[show edit update destroy]
  # before_action :correct_admin # , only: %i[show edit update destroy]
  before_action :set_purchase, only: %i[update destroy]
  # skip_before_action :login_required, only: %i[new create]
  skip_before_action :verify_authenticity_token # #後で消す

  # 仕入品一覧の表示
  def index
    @purchases = if params[:name]
                   Purchase.purchase_search(params[:name])
                 else
                   Purchase.all
                 end

    render json: @purchases
  end
end

# 仕入品の新規登録
def create
  @purchase = Purchase.new(purchase_params)

  if @purchase.save
    render json: @purchase, status: :created # 201
  else
    render json: @purchase.errors, status: :unprocessable_entity # 422
  end
end

# 仕入品情報更新
def update
  if @purchase.update(purchase_params)
    render json: @purchase
  else
    render json: @purchase.errors, status: :unprocessable_entity
  end
end

# 仕入品削除
def destroy
  @purchase.destroy
  head :ok
end

  ############################
  private

def set_purchase
  @purchase = Purchase.find(params[:id])
end

def purchase_params
  params.require(:purchase).permit(:name, :item_number, :is_food)
end
