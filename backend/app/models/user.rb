class User < ApplicationRecord
  has_many :order_records
  has_many :budgets

  validates :name, presence: true, length: { maximum: 255 }
  validates :email, presence: true, length: { maximum: 255 }, uniqueness: { message: 'メールアドレスはすでに使用されています' },
                    format: { with: /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i }
  before_validation { email.downcase! }
  validates :admin, inclusion: { in: [true, false] }
end
