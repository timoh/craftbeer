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

  # requires Geospatial Gem; note that it returns in format [lng, lat]
  # (not other way around)
  field :location, type: Point

  validates :loc_name, uniqueness: true
  validates :city, presence: true

  has_many :alco_avails

  def get_distance_to_point(lat=60.1688202, lng=24.9337834)
    # Urho Kekkosen Katu = [60.1688202, 24.9337834]

    begin
      store_lat = self.location[1]
      store_lng = self.location[0]
      raise "Missing store location for #{self.loc_name}!" unless store_lat && store_lng
    rescue Exception => details
      puts "Exception raised:"
      puts details
      raise "Cannot proceed current-to-store distance calculation; missing store location coordinates!"
    else
      current_location = GeoRuby::SimpleFeatures::Point.from_x_y_z(lat, lng, nil)
      store_location = GeoRuby::SimpleFeatures::Point.from_x_y_z(store_lat, store_lng, nil)

      return current_location.spherical_distance(store_location)
    end

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
    return JSON.parse(response)
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

  def dedupe_avails
    start_size = self.alco_avails.size
    puts "\n\n --- \n\n Starting with: "+start_size.to_s+" rows \n\n"
    avails = self.alco_avails

    avails.each do |avail|
      drink = avail.alco_drink
      avails_for_drink = avails.where(alco_drink: drink)

      # search for avails that have duplication
      if avails_for_drink.size > 1 # this means we have duplicates
        history_hash = Hash.new
        master_record_avail = avails_for_drink.order_by(created_at: "desc").first

        # populate history hash
        avails_for_drink.each do |inner_avail|

          # ensure history is not lost
          if inner_avail.history
          history_hash.reverse_merge!(inner_avail.history)
          end

          # merge histories but avoid overwriting
          unless history_hash[inner_avail.created_at.to_formatted_s(:db)]
            history_hash[inner_avail.created_at.to_formatted_s(:db)] = inner_avail.amount
          end
        end

        # save merged history hash
        master_record_avail.history = history_hash
        begin
          master_record_avail.save!
        rescue
          puts 'Save failed!'
        else
          # destroy old records
          while avails_for_drink.size > 1
            avails_for_drink.order_by(created_at: "asc").first.destroy
            avails_for_drink = avails.where(alco_drink: drink)
          end
        end
      end

    end

    end_size = self.alco_avails.size
    delta = start_size-end_size
    puts "\n\n --- \n\n Ended with: "+end_size.to_s+" rows \n\n"
    puts "\n\n --- \n\n Delta is: "+delta.to_s+" rows \n\n"
  end

  def AlcoLocation.dedupe_all_avails
    total_size = AlcoLocation.all.size
    counter = 0

    puts "Beginning to deduplicate "+total_size.to_s+" rows."
    AlcoLocation.all.each do |loc|
      counter = counter + 1
      loc.dedupe_avails
      # progress indicator
      puts " --- Progress: "+counter.to_s+ " / "+total_size.to_s+"."
    end
  end

end
