# spec/models/order_record_spec.rb
require 'rails_helper'

RSpec.describe OrderRecord, type: :model do
  describe 'associations' do
    it { is_expected.to belong_to(:supplier) }
    it { is_expected.to belong_to(:user) }
    it { is_expected.to have_many(:order_details).dependent(:destroy) }
  end

  describe 'validations' do
    it { is_expected.to validate_presence_of(:order_status) }
    it { is_expected.to validate_presence_of(:total_amount) }
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

  describe 'scopes' do
    let!(:order_record) do
      create(:order_record, order_status: 1, order_date: '2021-01-01', supplier:, user:)
    end
    let!(:supplier) { create(:supplier, name: 'Test Supplier') }
    let!(:user) { create(:user) }

    it 'searches by supplier name' do
      expect(OrderRecord.search_by_supplier_name('Test')).to include(order_record)
    end

    it 'searches by purchase name' do
      # Assuming purchase name is setup in your factory
      expect(OrderRecord.search_by_purchase_name('Purchase Name')).to include(order_record)
    end

    it 'searches by order date' do
      expect(OrderRecord.search_by_order_date('2021-01-01')).to include(order_record)
    end

    it 'searches by order status' do
      expect(OrderRecord.search_by_order_status('1')).to include(order_record)
    end
  end
end
