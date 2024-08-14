require 'rails_helper'

RSpec.describe Budget, type: :model do
  describe 'associations' do
    it { is_expected.to belong_to(:user) }
  end

  describe 'validations' do
    it { is_expected.to validate_presence_of(:year) }
    it { is_expected.to validate_presence_of(:month) }
    it { is_expected.to validate_presence_of(:purchase_budget) }
    it { is_expected.to validate_numericality_of(:purchase_budget) }

    it { is_expected.to validate_presence_of(:alert_threshold) }
    it { is_expected.to validate_numericality_of(:alert_threshold) }
  end
end
