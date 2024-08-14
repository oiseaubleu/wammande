require 'rails_helper'

RSpec.describe RemainingBudgetCalculator, type: :model do
  describe '#calculate' do
    let(:user) { create(:user) }
    let!(:budgets) do
      [
        create(:budget, user:, year: 2021, month: 7, purchase_budget: 1000),
        create(:budget, user:, year: 2021, month: 8, purchase_budget: 1500)
      ]
    end
    let!(:order_records) do
      [
        create(:order_record, user:, order_date: '2021-07-15', total_amount: 300),
        create(:order_record, user:, order_date: '2021-08-10', total_amount: 450)
      ]
    end

    it 'calculates remaining budgets correctly' do
      calculator = RemainingBudgetCalculator.new
      result = calculator.calculate

      expect(result.map(&:remaining_budget)).to match_array([700, 1050])
      expect(result.map(&:total_budget)).to match_array([1000, 1500])
      expect(result.map(&:total_order_amount)).to match_array([300, 450])
    end
  end
end
