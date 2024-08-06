# user---------------------------------------------
# # general_user = User.create!(name: '一般ユーザ', email: 'ippan@aaa.aa', password: '123456', admin: false)
# # admin_user = User.create!(name: '管理者ユーザ', email: 'kanrisha@aaa.aa', password: '123456', admin: true)

10.times do |n|
  User.create!(name: "一般ユーザ#{n + 1}", email: "ippan#{n + 1}@ippan.seed", password: '123456', admin: false)
end

2.times do |n|
  User.create!(name: "管理者ユーザ#{n + 1}", email: "kanri#{n + 1}@kanri.seed", password: '123456', admin: true)
end

# # budget---------------------------------------------
# # budget = Budget.new(
# #   year: 2024,
# #   month: 7,
# #   purchase_budget: 10000.00,
# #   alert_threshold: 5000.00,
# #   comment: '月間の仕入れ予算',
# #   user_id: 2
# # )

12.times do |n|
  Budget.create!(year: 2023,
                 month: n + 1,
                 purchase_budget: n * 1000.00,
                 alert_threshold: n * 200.00,
                 comment: "2023年#{n + 1}月の仕入れ予算'",
                 user_id: 2)
end

# # purchase---------------------------------------------
# purchase_test = Purchase.new(name: "仕入品sample", item_number: "001A", is_food: true)
10.times do |n|
  Purchase.create!(name: "仕入食材#{n + 1}", is_food: true)
end

10.times do |n|
  Purchase.create!(name: "仕入品#{n + 1}", is_food: false)
end

## # supplier---------------------------------------------
# #supplier_sample = Supplier.new(name: "仕入先", cycle_value: 7, cycle_unit: 0, how_to_order: 1)
# date_list = ['2025/10/01', '2025/12/01', '2025/01/01', '2025/05/01', '2025/03/01', '2025/11/01', '2025/02/01',
# '2025/09/01', '2025/04/01', '2025/01/01']
# cycle_unit_list = [1, 0, 2, 3, 1, 0, 2, 3, 0, 2]
# how_to_order_list = [1, 0, 2, 3, 1, 0, 2, 3, 0, 2]
# 10.times do |n|
#   Supplier.create!(name: "仕入先#{n+1}", cycle_value: n+1, cycle_unit: cycle_unit_list[n], how_to_order: how_to_order_list[n], next_purchase_day: date_list[n])
# end

## # supplier_purchase---------------------------------------------
# #supplier_purchase_sample = SupplierPurchase.new(supplier_id: 13, purchase_id: 1, price: 20, version: 0, purchase_count: 0)
# 5.times do |n|
#   SupplierPurchase.create!(supplier_id: Supplier.first.id, purchase_id: n+1, price: n+10, version: 0, purchase_count: 0, comment:"コメント#{n+1}", item_number: "01#{n+1}A")
# end
# 5.times do |n|
#   SupplierPurchase.create!(supplier_id: Supplier.last.id, purchase_id: n+1, price: n+20, version: 0, purchase_count: 0, comment:"コメント#{n+1}", item_number: "10#{n+1}A")
# end

# # order record---------------------------------------------
# OrderRecord.new(supplier_id: 27, order_status: 0, order_date: "2024-08-06T00:00:00.000Z", delivery_date: "2024-08-06T00:00:00.000Z", total_amount: 600, user_id: 15).save
order_status_list = [0, 1, 2, 3, 4, 0]
4.times do |n|
  OrderRecord.create!(supplier_id: Supplier.first.id, order_status: n + 1, order_date: '2024-08-06T00:00:00.000Z',
                      delivery_date: '2024-08-06T00:00:00.000Z', total_amount: 0, user_id: User.first.id)
end

# # order detail---------------------------------------------
# orederDetail_sample=OrderDetail.new( order_record_id: 1, supplier_purchase_id: 30, quantity: 1, comment: "1つめのやつ", subtotal_amount: 200, order_status: 0)
order_status_list = [0, 1, 2, 3, 4, 0]

4.times do |n|
  OrderDetail.create!(order_record_id: OrderRecord.last.id,
                      supplier_purchase_id: Supplier.last.supplier_purchases[0].id, quantity: n + 1, comment: '1つめのやつ', subtotal_amount: Supplier.last.supplier_purchases[0].price * (n + 1), order_status: order_status_list[n + 1])
end
