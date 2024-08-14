require 'rails_helper'

RSpec.describe User, type: :model do
  describe 'associations' do
    it { is_expected.to have_many(:order_records) }
    it { is_expected.to have_many(:budgets) }
  end

  describe 'validations' do
    it { is_expected.to validate_presence_of(:name) }
    it { is_expected.to validate_length_of(:name).is_at_most(255) }

    it { is_expected.to validate_presence_of(:email) }
    it { is_expected.to validate_length_of(:email).is_at_most(255) }
    it { is_expected.to validate_uniqueness_of(:email).case_insensitive.with_message('メールアドレスはすでに使用されています') }
    it { is_expected.to allow_value('user@example.com').for(:email) }
    it { is_expected.not_to allow_value('userexample.com').for(:email) }

    it { is_expected.to validate_inclusion_of(:admin).in_array([true, false]) }
  end

  describe '#email_downcasing' do
    let(:user) { User.create(name: 'Test User', email: 'TEST@EXAMPLE.COM', admin: false) }

    it 'downcases an email before validation' do
      expect(user.email).to eq('test@example.com')
    end
  end
end
