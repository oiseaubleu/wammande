class SuppliersController < ApplicationController
  # before_action :set_admin, only: %i[show edit update destroy]
  #before_action :correct_admin # , only: %i[show edit update destroy]
  before_action :set_supplier, only: %i[update destroy]
  # skip_before_action :login_required, only: %i[new create]
  skip_before_action :verify_authenticity_token##後で消す
  
  # 仕入先一覧の表示
  def index
    @suppliers = Supplier_purchase.all
    render json: @suppliers
  end


  # 仕入先の新規登録##########
  def create
    #@supplier = Supplier.new(supplier_params)
    
  @supplier_purchases = Supplier_purchases.new(supplier_purchases_params) #Supplier.find(14).supplier_purchases
    #binding.irb
    


    if @supplier.save
      render json: @supplier, status: :created #201
    elsif 
      render json: @supplier.errors, status: :unprocessable_entity #422
    end
  end

  # 仕入先情報更新##########
  def update
    if @supplier.update(supplier_params)
      render json: @supplier
    else
      render json: @supplier.errors, status: :unprocessable_entity
    end
  end

  #仕入先削除
  def destroy
    @supplier.destroy
    @supplier_purchases.destroy
    head :ok
  end


  
  ############################
  private

  def set_supplier
    @supplier = Supplier.find(params[:id])
  end

  def supplier_params
    params.require(:supplier).permit(:name, :cycle_value, :cycle_unit, :how_to_order,:next_purchase_day)
  end

  def supplier_purchases_params
    params.require(:supplier_purchase).permit(:purchase_id,:purchase_name, :item_number,:price, :comment)
  end


end
