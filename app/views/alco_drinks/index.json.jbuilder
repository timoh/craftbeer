json.array!(@alco_drinks) do |alco_drink|
  json.extract! alco_drink, :id, :title, :price, :type, :size, :url, :alko_id, :created_at, :updated_at, :best_rev_candidate_score, :review_score, :pic_cloudinary
  json.url alco_drink_url(alco_drink, format: :json)
end
