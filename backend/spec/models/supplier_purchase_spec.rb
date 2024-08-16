require 'rails_helper'

RSpec.describe SupplierPurchase, type: :model do
  describe 'associations' do
    it { is_expected.to belong_to(:supplier) }
    it { is_expected.to belong_to(:purchase) }
    it { is_expected.to have_many(:order_details) }
  end

  describe 'validations' do
    it { is_expected.to validate_presence_of(:price) }
    it { is_expected.to validate_numericality_of(:price) }

    it { is_expected.to validate_presence_of(:version) }
    it { is_expected.to validate_numericality_of(:version) }

    it { is_expected.to validate_presence_of(:purchase_count) }
    it { is_expected.to validate_numericality_of(:purchase_count) }
  end
end
