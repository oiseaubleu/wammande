class OrdersController < ApplicationController
  include Authenticatable

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
    @order.user_id = 1 # #後でcurrent_userに修正
    # binding.irb

    if @order.save
      update_next_purchase_day if @order.order_status == 'ordered_pending_delivery'
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
      if @order.order_status_changed? && @order.order_status_was == 'not_ordered' && @order.order_status == 'ordered_pending_delivery'
        update_next_purchase_day
      end
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

  # TOPページに必要な情報を取得
  # 未発注リストの抽出方法は...
  # - supplier.next_purchase_dayが今日からX日以内である
  # - このとき、order_recordが...
  #   - そもそも存在しない
  #   - next_purchase_day以前のレコードが存在するがorder_statusがnot_orderedである
  def todo
    not_ordered = OrderRecord.where(order_status: 0).map do |order|
      {
        order_id: order.id,
        supplier_id: order.supplier_id,
        supplier_name: order.supplier.name,
        supplier_cycle_value: order.supplier.cycle_value,
        supplier_cycle_unit: order.supplier.cycle_unit,
        next_purchase_day: order.supplier.next_purchase_day,
        order_date: order.order_date
      }
    end

    ordered_pending_delivery = OrderRecord.where(order_status: 1).map do |order|
      {
        order_id: order.id,
        supplier_id: order.supplier_id,
        supplier_name: order.supplier.name,
        supplier_cycle_value: order.supplier.cycle_value,
        supplier_cycle_unit: order.supplier.cycle_unit,
        next_purchase_day: order.supplier.next_purchase_day,
        order_date: order.order_date
      }
    end

    render json: { not_ordered:, ordered_pending_delivery: }
  end

  ############################
  private

  def set_order
    @order = OrderRecord.find(params[:id])
  end

  def order_params
    params.require(:order).permit(
      :supplier_id, :order_status, :order_date, :delivery_date, :total_amount,
      order_details_attributes: %i[id supplier_purchase_id quantity comment subtotal_amount order_status _destroy]
    )
  end

  def update_next_purchase_day
    # TODO: 発注がイレギュラーな日付だった場合に、次回発注予定日もくるってしまう
    # 本当は、定期的な発注と、イレギュラーな発注を区別して次回発注予定日を更新したい
    @order.supplier.update(next_purchase_day: @order.order_date + @order.supplier.purchase_interval)
  end
end
