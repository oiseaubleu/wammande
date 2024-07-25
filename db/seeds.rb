
# user---------------------------------------------
# # general_user = User.create!(name: '一般ユーザ', email: 'ippan@aaa.aa', password: '123456', admin: false)
# # admin_user = User.create!(name: '管理者ユーザ', email: 'kanrisha@aaa.aa', password: '123456', admin: true)

# 10.times do |n|
#   User.create!(name: "一般ユーザ#{n + 1}", email: "ippan#{n + 1}@ippan.seed", password:'123456', admin: false)
# end

# 2.times do |n|
#   User.create!(name: "管理者ユーザ#{n + 1}", email: "kanri#{n + 1}@kanri.seed", password:'123456', admin: true)
# end

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
  month: n+1,
  purchase_budget: n*1000.00,
  alert_threshold: n*200.00,
  comment: "2023年#{n+1}月の仕入れ予算'",
  user_id: 2
  )
end

# # budget---------------------------------------------
# #purchase_test = Purchase.new(name: "仕入品sample", item_number: "001A", is_food: true)
# 10.times do |n|
#   Purchase.create!(name: "仕入食材#{n+1}", item_number: "01#{n+1}A", is_food: true )
# end

# 10.times do |n|
#   Purchase.create!(name: "仕入品#{n+1}", item_number: "10#{n+1}A", is_food: false )
# end