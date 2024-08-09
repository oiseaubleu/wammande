class Budget < ApplicationRecord
  belongs_to :user

  # presence validation
  validates :year, presence: true
  validates :month, presence: true
  validates :purchase_budget, presence: true, numericality: true
  validates :alert_threshold, presence: true, numericality: true
end
