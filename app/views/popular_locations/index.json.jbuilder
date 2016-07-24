json.array!(@popular_locations) do |popular_location|
  json.extract! popular_location, :id, :address, :city, :coords
  json.url popular_location_url(popular_location, format: :json)
end
