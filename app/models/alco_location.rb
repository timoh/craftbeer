class AlcoLocation
  include Mongoid::Document
  include Mongoid::Timestamps

  require 'georuby'
  #include GeoRuby::SimpleFeatures

  include Mongoid::Geospatial

  field :loc_name, type: String
  field :alko_store_id, type: Integer
  field :store_link, type: String
  field :url, type: String
  field :city, type: String
  field :address, type: String
  field :postal_code, type: String

  # requires Geospatial Gem
  field :location, type: Point

  validates :loc_name, uniqueness: true
  validates :city, presence: true

  has_many :alco_avails

  def get_distance_to_point(lat=60.1688202, lng=24.9337834)
    # Urho Kekkosen Katu = 60.1688202, 24.9337834

    current_location = GeoRuby::SimpleFeatures::Point.from_x_y_z(lat, lng, nil)
    store_location = GeoRuby::SimpleFeatures::Point.from_x_y_z(self.location[1], self.location[0], nil)

    return current_location.spherical_distance(store_location)
  end

  def AlcoLocation.get_distances_to_point(lat=60.1688202, lng=24.9337834)
    locs = AlcoLocation.all
    distances = Array.new
    locs.each do |loc|
      d = loc.get_distance_to_point(lat, lng).to_i
      distances.append({:location_name => loc['loc_name'], :distance_in_m => d, :latlng => loc.location})
    end

    return distances
  end

  def AlcoLocation.perform_request
    require 'rest-client'
    require 'json'
    alko_location_endpoint = 'http://www.alko.fi/api/store/mapmarkers?language=fi'
    response = RestClient.get(alko_location_endpoint)
    return raw_data = JSON.parse(response)
  end

  def AlcoLocation.populate_location_data

    raw_data = AlcoLocation.perform_request

    puts 'Length of response: '+raw_data.length.to_s

    puts 'Attempting to process..'

    begin

      raw_data.each do |item|
        puts 'Now processing: '+item['name']
        # sample data:
        # {
        #   "storeId": "2102",
        #   "name": "Helsinki keskusta Arkadia",
        #   "url": "/myymalat-palvelut/2102/",
        #   "latitude": 60.170814,
        #   "longitude": 24.934792,
        #   "address": "Salomonkatu 1",
        #   "postalCode": "00100",
        #   "locality": "HELSINKI"
        # }

        loc_name = item['name']
        puts "Attempting to seach for "+loc_name

        begin
          loc = AlcoLocation.find_by(loc_name: loc_name)
        rescue Exception  => detail
          puts 'Location not found!'
          puts detail
        else
          if loc
            begin
              loc.alko_store_id = item['storeId']
              loc.address = item['address']
              loc.postal_code = item['postalCode']
              loc.location = {latitude: item['latitude'].to_f, longitude: item['longitude'].to_f}
              loc.save!
            rescue Exception  => detail
              puts 'Saving location failed!'
              puts detail
              raise
            else
              puts "Processing for "+item['name']+" successful, moving on!"
            end
          else
            puts item['name']+' not found!'
          end
        end

      end

    rescue Error => detail
      puts detail
      raise
    else
      puts "Processing successful!"
    end

  end

  # def self.get_address(store_link='myymalat-palvelut/2141/')
  #
  #   require 'rest-client'
  #   require 'json'
  #
  #   url = 'https://api.spotify.com/v1/search?type=artist&q=tycho'
  #   response = RestClient.get(url)
  #   JSON.parse(response)
  #
  #
  #
  #   # body > div:nth-child(12) > div > div.main-content.StoreViewPage > div > div > div > div.store-contact.desktop > span.contact-info.address > div > span:nth-child(2)
  #
  #   page.at('body > div:nth-child(12) > div > div.main-content.StoreViewPage > div > div > div > div.store-contact.desktop > span.contact-info.address > div > span:nth-child(2)').text
  #
  # end

end
