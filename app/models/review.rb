class Review
  include Mongoid::Document
  include Mongoid::Timestamps
  field :title, type: String
  field :url, type: String
  field :score, type: Integer
  field :company, type: String
  field :type, type: String


  def Review.get_kimono
    require 'rest-client'
    require 'json'
    response = RestClient.get(Settings[:apis][:review_path].to_s)
    j = JSON.parse(response)
  end

  def Review.store_kimono(hash) # takes .get_kimono result and tries to store into DB
    arr = hash['results']['collection1']

    arr.each do |row|
      # ["Otsikko", "Tyyppi", "Panimo", "Arvio", "index", "url"]

      a = Review.new

      a.title = row["Otsikko"]
      a.url = row["url"]
      a.score = row["Arvio"]
      a.company = row["Panimo"]["text"]
      a.type = row["Tyyppi"]["type"]

      a.save # will fail if duplicate URL or title!
    end

  end

end
