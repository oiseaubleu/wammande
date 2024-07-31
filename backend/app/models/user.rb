class User < ApplicationRecord
  has_many :order_records
  has_many :budgets

  validates :name, presence: true, length: { maximum: 255 }
  validates :email, presence: true, length: { maximum: 255 }, uniqueness: { message: 'メールアドレスはすでに使用されています' },
                    format: { with: /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i }
  before_validation { email.downcase! }
  has_secure_password
  validates :password, presence: true, length: { minimum: 6, message: 'パスワードは6文字以上で入力してください' }
  validates :admin, inclusion: { in: [true, false] }
end
