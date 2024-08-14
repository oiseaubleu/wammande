# spec/models/supplier_spec.rb
require 'rails_helper'

RSpec.describe Supplier, type: :model do
  describe 'associations' do
    it { is_expected.to have_many(:order_records) }
    it { is_expected.to have_many(:supplier_purchases).dependent(:destroy) }
    it { is_expected.to have_many(:purchases).through(:supplier_purchases) }
  end

  describe 'validations' do
    it { is_expected.to validate_presence_of(:name) }
    it { is_expected.to validate_presence_of(:cycle_value) }
    it { is_expected.to validate_presence_of(:cycle_unit) }
    it { is_expected.to validate_presence_of(:how_to_order) }
    it { is_expected.to validate_presence_of(:next_purchase_day) }
  end

  describe 'enums' do
    it { is_expected.to define_enum_for(:cycle_unit).with_values(daily: 0, weekly: 1, monthly: 2, yearly: 3) }
    it { is_expected.to define_enum_for(:how_to_order).with_values(application: 0, direct: 1, online: 2, email: 3) }
  end

  describe '#purchase_interval' do
    let(:supplier) { build(:supplier, cycle_value: 1) }

    it 'returns correct interval for daily cycle' do
      supplier.cycle_unit = 'daily'
      expect(supplier.purchase_interval).to eq 1.day
    end

    it 'returns correct interval for weekly cycle' do
      supplier.cycle_unit = 'weekly'
      expect(supplier.purchase_interval).to eq 1.week
    end

    it 'returns correct interval for monthly cycle' do
      supplier.cycle_unit = 'monthly'
      expect(supplier.purchase_interval).to eq 1.month
    end

    it 'returns correct interval for yearly cycle' do
      supplier.cycle_unit = 'yearly'
      expect(supplier.purchase_interval).to eq 1.year
    end
  end
end
