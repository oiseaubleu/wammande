class OrdersController < ApplicationController
  before_action :set_order, only: %i[show update destroy]
  skip_before_action :verify_authenticity_token # #後で消す

  # 仕入先一覧の表示
  def index
    @orders = OrderRecord.all
    render json: @orders
  end

  # 仕入先の新規登録##########
  def create
    @order = OrderRecord.new(order_params)
    @order.user_id = 14 # #後でcurrent_userに修正
    # binding.irb

    if @order.save
      render json: @order, status: :created, include: :order_details # 201
    else
      render json: @order.errors, status: :unprocessable_entity
    end
  end

  # 仕入先一覧の表示()
  def new
    render json: Supplier.all.map { |supplier|
      {
        **supplier.attributes,
        supplier_purchases: supplier.supplier_purchases.map do |supplier_purchase|
          {
            **supplier_purchase.attributes,
            purchase_name: supplier_purchase.purchase.name
          }
        end
      }
    }
  end

  # 仕入先情報更新##########
  def update
    if @order.update(order_params)
      render json: @order, include: :order_details
    else
      render json: @order.errors, status: :unprocessable_entity
    end
  end

  # def show
  #   render json: @order, include: :order_details
  # end
  def show
    render json: {
      **@order.attributes,
      supplier_name: @order.supplier.name,
      order_details: @order.order_details.map do |order_detail|
        {
          **order_detail.attributes,
          purchase_name: order_detail.supplier_purchase.purchase.name
        }
      end
    }
  end

  # 仕入先削除
  def destroy
    @order.destroy
    head :ok
  end

  ############################
  private

  def set_order
    @order = OrderRecord.find(params[:id])
  end

  def order_params
    params.require(:order).permit(
      :supplier_id, :order_status, :order_date, :delivery_date, :total_amount,
      order_details_attributes: %i[supplier_purchase_id quantity comment subtotal_amount order_status _destroy]
    )
  end
end
