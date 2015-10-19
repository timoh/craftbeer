class AlcoDrink
  include Mongoid::Document
  include Mongoid::Timestamps
  field :title, type: String
  field :price, type: Float
  field :type, type: String
  field :size, type: Float
  field :url, type: String

  validates :url, uniqueness: true
  validates :title, uniqueness: true

  def AlcoDrink.get_kimono
    require 'rest-client'
    require 'json'
    response = RestClient.get(Settings[:apis][:alco_drink_path].to_s)
    j = JSON.parse(response)['results']['collection1']
  end

  def AlcoDrink.store_kimono(hash) # takes .get_kimono result and tries to store into DB
    hash.each do |row|
      # ["Otsikko", "Hinta", "Tyyppi", "Koko", "index", "url"]

      a = AlcoDrink.new

      a.title = row["Otsikko"]
      a.price = row["Hinta"]
      a.type = row["Tyyppi"]
      a.size = row["Koko"]
      a.url = row["url"]

      a.save # will fail if duplicate URL or title!
    end

  end

end
