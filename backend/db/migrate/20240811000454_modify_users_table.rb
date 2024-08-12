class ModifyUsersTable < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :cognito_status, :string, default: 'unconfirmed'
    add_column :users, :subject, :string
    remove_column :users, :password_digest
    add_index :users, :subject, unique: true, if_not_exists: true
  end
end
