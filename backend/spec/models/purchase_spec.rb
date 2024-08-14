# spec/models/purchase_spec.rb
require 'rails_helper'

RSpec.describe Purchase, type: :model do
  describe 'associations' do
    it { is_expected.to have_many(:supplier_purchases) }
    it { is_expected.to have_many(:suppliers).through(:supplier_purchases) }
  end

  describe 'validations' do
    it { is_expected.to validate_presence_of(:name) }
    it do
      is_expected.to validate_inclusion_of(:is_food).in_array([true, false])
    end
  end

  describe 'scopes' do
    let!(:purchase_one) { create(:purchase, name: 'Apple Juice') }
    let!(:purchase_two) { create(:purchase, name: 'Banana Smoothie') }

    it 'returns purchases that match the search term' do
      expect(Purchase.purchase_search('Apple')).to include(purchase_one)
      expect(Purchase.purchase_search('Apple')).not_to include(purchase_two)
    end
  end
end
