# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2024_07_25_052911) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "budgets", force: :cascade do |t|
    t.integer "year", null: false
    t.integer "month", null: false
    t.decimal "purchase_budget", null: false
    t.decimal "alert_threshold", null: false
    t.text "comment"
    t.bigint "user_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["user_id"], name: "index_budgets_on_user_id"
  end

  create_table "order_details", force: :cascade do |t|
    t.bigint "order_record_id", null: false
    t.bigint "supplier_purchase_id", null: false
    t.decimal "quantity", null: false
    t.text "comment"
    t.decimal "subtotal_amount", null: false
    t.integer "order_status", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["order_record_id"], name: "index_order_details_on_order_record_id"
    t.index ["supplier_purchase_id"], name: "index_order_details_on_supplier_purchase_id"
  end

  create_table "order_records", force: :cascade do |t|
    t.bigint "supplier_id", null: false
    t.integer "order_status", null: false
    t.datetime "order_date"
    t.datetime "delivery_date"
    t.decimal "total_amount", null: false
    t.bigint "user_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["supplier_id"], name: "index_order_records_on_supplier_id"
    t.index ["user_id"], name: "index_order_records_on_user_id"
  end

  create_table "purchases", force: :cascade do |t|
    t.string "name", null: false
    t.string "item_number"
    t.boolean "is_food", default: true, null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "supplier_purchases", force: :cascade do |t|
    t.bigint "supplier_id", null: false
    t.bigint "purchase_id", null: false
    t.decimal "price", null: false
    t.bigint "version", null: false
    t.bigint "purchase_count", default: 0, null: false
    t.text "comment"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["purchase_id"], name: "index_supplier_purchases_on_purchase_id"
    t.index ["supplier_id"], name: "index_supplier_purchases_on_supplier_id"
  end

  create_table "suppliers", force: :cascade do |t|
    t.string "name", null: false
    t.integer "cycle_value", null: false
    t.integer "cycle_unit", null: false
    t.integer "how_to_order", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.datetime "next_purchase_day", default: -> { "CURRENT_TIMESTAMP" }, null: false
  end

  create_table "users", force: :cascade do |t|
    t.string "name", null: false
    t.string "email", null: false
    t.string "password_digest", null: false
    t.boolean "admin", default: false, null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["email"], name: "index_users_on_email", unique: true
  end

  add_foreign_key "budgets", "users"
  add_foreign_key "order_details", "order_records"
  add_foreign_key "order_details", "supplier_purchases"
  add_foreign_key "order_records", "suppliers"
  add_foreign_key "order_records", "users"
  add_foreign_key "supplier_purchases", "purchases"
  add_foreign_key "supplier_purchases", "suppliers"
end
