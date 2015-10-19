class AlcoLocation
  include Mongoid::Document
  include Mongoid::Timestamps
  field :loc_name, type: String
  field :url, type: String
  field :city, type: String

  validates :loc_name, uniqueness: true
  validates :city, presence: true

  has_many :alco_avails
end
