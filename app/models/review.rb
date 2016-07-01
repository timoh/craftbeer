class Review
  include Mongoid::Document
  include Mongoid::Timestamps
  field :title, type: String
  field :url, type: String
  field :score, type: Integer
  field :company, type: String
  field :type, type: String

  belongs_to :alco_drink

  def Review.get_parsehub
    require 'rest-client'
    require 'json'
    url = Rails.application.secrets.review_url
    response = RestClient.get url, {:params => {:api_key => Rails.application.secrets.review_api_token}}
    return JSON.parse(response)['beers']
  end

  def Review.store_parsehub
    puts "Fetching review data from ParseHub"
    data = Review.get_parsehub
    puts "Fetching donw, iterating over each row in memory"
    data.each do |row|
      existing_review = Review.where(url: row["url"]).first

      unless existing_review
        puts "Creating new row for: #{row["beer"][0]["beerTitle"]}"
        a = Review.new

        a.title = row["beer"][0]["beerTitle"]
        a.url = row["url"]
        a.score = row["beer"][0]["beerScore"].to_i
        a.company = row["beer"][0]["beerBrewery"]
        a.type = row["beer"][0]["beerType"]

        a.save # will fail if duplicate URL or title!
      else
        puts "Updating existing row for: #{row["beer"][0]["beerTitle"]}"
        # even if review exists, update type and score
        existing_review.type = row["beer"][0]["beerType"]
        existing_review.score = row["beer"][0]["beerScore"].to_i
        existing_review.save
      end
    end
    puts "All done with getting reviews!"
  end

end
