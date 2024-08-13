class Task < ApplicationRecord
  belongs_to :user
  has_and_belongs_to_many :labels
  validates :title, :content, :deadline_on, :priority, :status, presence: true
  enum priority: %i[low middle high]
  enum status: %i[waiting working completed]

  scope :search, lambda { |search_params, sort_deadline_on, sort_priority|
                   status_search(search_params[:status])
                     .title_search(search_params[:title])
                     .label_search(search_params[:label])
                     # .label_search(search_params[:name][:id])
                     .latest_deadline(sort_deadline_on)
                     .highest_priority(sort_priority)
                     .normal_sort
                 }

  scope :status_search, ->(status) { where(status:) if status.present? }
  scope :title_search, ->(part) { where('title like ?', "%#{part}%") if part.present? }
  scope :label_search, ->(label) { joins(:labels).where(labels: { id: label }) if label.present? }
  scope :latest_deadline, ->(sort_deadline_on) { order(deadline_on: :asc) if sort_deadline_on }
  scope :highest_priority, ->(sort_priority) { order(priority: :desc) if sort_priority }
  # デフォルトスコープみたいのがあるらしいけど・・
  scope :normal_sort, -> { order(created_at: :desc) }
end
