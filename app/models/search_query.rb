class SearchQuery
  include Mongoid::Document
  include Mongoid::Timestamps
  #
  # require 'georuby'
  # #include GeoRuby::SimpleFeatures

  include Mongoid::Geospatial

  field :query, type: String

  # requires Geospatial Gem; note that it returns in format [lng, lat]
  # (not other way around)
  field :coords, type: Point

  validates :query, presence: true
  validates :coords, presence: true
end
