# spec/models/order_detail_spec.rb
require 'rails_helper'

RSpec.describe OrderDetail, type: :model do
  describe 'associations' do
    it { is_expected.to belong_to(:order_record) }
    it { is_expected.to belong_to(:supplier_purchase) }
  end

  describe 'validations' do
    it { is_expected.to validate_presence_of(:quantity) }
    it { is_expected.to validate_presence_of(:subtotal_amount) }
    it { is_expected.to validate_presence_of(:order_status) }
  end

  describe 'enum' do
    it do
      is_expected.to define_enum_for(:order_status).with_values(
        not_ordered: 0,
        ordered_pending_delivery: 1,
        order_cancelled: 2,
        delivered: 3,
        delivery_cancelled: 4
      ).backed_by_column_of_type(:integer)
    end
  end
end
