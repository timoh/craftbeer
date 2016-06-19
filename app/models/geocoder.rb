class Geocoder
  require 'rest_client'
  require 'uri'

  # requires Rails.application.secrets.googlemaps_token
  # API docs: https://developers.google.com/maps/documentation/geocoding

  def Geocoder.get_token
    begin
      raise "Google Maps token missing from secrets.yml!" unless Rails.application.secrets.googlemaps_token
      access_token = Rails.application.secrets.googlemaps_token
      return access_token
    rescue
      puts "Getting token failed!"
    end
  end

  def Geocoder.geocode(address, country="FI") # returns Hash = {:lat, :lng}
    begin
      access_token = Geocoder.get_token
      address = URI.escape(address)
    rescue
      puts "Initialization failed!"
    else
      output = RestClient.get "https://maps.googleapis.com/maps/api/geocode/json?address=#{address}&key=#{access_token}&components=country:#{country}"
      output = JSON.parse(output)
      begin
        # returns {:lat, :lng}
        return output['results'][0]['geometry']['location']
      rescue
        puts "Geocoding failed!"
      end
    end
  end

  def Geocoder.reverse_geocode(lat, lng) # returns String (formatted_address)
    begin
      access_token = Geocoder.get_token
      lat = URI.escape(lat.to_s)
      lng = URI.escape(lng.to_s)
    rescue
      puts "Initialization failed!"
    else
      output = RestClient.get "https://maps.googleapis.com/maps/api/geocode/json?latlng=#{lat},#{lng}&key=#{access_token}&result_type=street_address"
      output = JSON.parse(output)
      output = output['results'][0]['formatted_address']
      begin
        # returns {:lat, :lng}
        return output
      rescue
        puts "Geocoding failed!"
      end
    end
  end

end
