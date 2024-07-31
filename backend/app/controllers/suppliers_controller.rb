class SuppliersController < ApplicationController
  before_action :set_supplier, only: %i[show update destroy]
  skip_before_action :verify_authenticity_token # #後で消す

  # 仕入先一覧の表示
  def index
    @suppliers = SupplierPurchase.all
    render json: @suppliers
  end

  # 仕入先の新規登録##########
  def create
    @supplier = Supplier.new(supplier_params)
    binding.irb

    if @supplier.save
      render json: @supplier, status: :created, include: :supplier_purchases # 201
    else
      render json: @supplier.errors, status: :unprocessable_entity
    end
  end

  # 仕入先情報更新##########
  def update
    if @supplier.update(supplier_params)
      render json: @supplier, include: :supplier_purchases
    else
      render json: @supplier.errors, status: :unprocessable_entity
    end
  end

  def show
    render json: @supplier, include: :supplier_purchases
  end

  # 仕入先削除
  def destroy
    @supplier.destroy
    head :ok
  end

  ############################
  private

  def set_supplier
    @supplier = Supplier.find(params[:id])
  end

  def supplier_params
    params.require(:supplier).permit(
      :name, :cycle_value, :cycle_unit, :how_to_order, :next_purchase_day,
      supplier_purchases_attributes: %i[id purchase_id price version purchase_count comment item_number _destroy]
    )
  end
end
