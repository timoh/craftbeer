json.array!(@alco_drinks) do |alco_drink|
  json.extract! alco_drink, :id, :title, :price, :type, :size, :url
  json.url alco_drink_url(alco_drink, format: :json)
end
