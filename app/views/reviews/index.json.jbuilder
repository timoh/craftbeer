json.array!(@reviews) do |review|
  json.extract! review, :id, :title, :url, :score, :company, :type
  json.url review_url(review, format: :json)
end
