require 'rails_helper'

RSpec.describe RemainingBudgetCalculator, type: :model do
  describe '#calculate' do
    let(:user) { create(:user) }
    let!(:budget1) { create(:budget, user:, year: 2021, month: 7, purchase_budget: 1000) }
    let!(:budget2) { create(:budget, user:, year: 2021, month: 8, purchase_budget: 1500) }

    let!(:order_record1) { create(:order_record, user:, order_date: '2021-07-15', total_amount: 200) }
    let!(:order_record2) { create(:order_record, user:, order_date: '2021-07-25', total_amount: 300) }
    let!(:order_record3) { create(:order_record, user:, order_date: '2021-08-01', total_amount: 500) }

    it 'calculates remaining budget correctly' do
      results = RemainingBudgetCalculator.new.calculate

      expect(results.length).to eq(2)
      expect(results[0].total_budget.to_f).to eq(1000.0)
      expect(results[0].total_order_amount.to_f).to eq(500.0)
      expect(results[0].remaining_budget.to_f).to eq(500.0)
      expect(results[1].total_budget.to_f).to eq(1500.0)
      expect(results[1].total_order_amount.to_f).to eq(500.0)
      expect(results[1].remaining_budget.to_f).to eq(1000.0)
    end
  end
end
