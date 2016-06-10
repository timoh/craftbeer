class AlcoDrink
  include Mongoid::Document
  include Mongoid::Timestamps
  field :title, type: String
  field :price, type: Float
  field :type, type: String
  field :size, type: Float
  field :url, type: String
  field :alko_id, type: String
  field :best_rev_candidate_score, type: Float # match score

  validates :url, uniqueness: true
  validates :title, uniqueness: true
  validates :alko_id, uniqueness: true
  validates :alko_id, presence: true

  has_many :alco_avails
  has_one :review

  def AlcoDrink.get_kimono
    require 'rest-client'
    require 'json'
    response = RestClient.get(Settings[:apis][:alco_drink_path].to_s)
    j = JSON.parse(response)['results']['collection1']
  end

  def get_pic
    pic_id = self.alko_id
    from_uri = 'http://cdn.alko.fi/ProductImages/Scaled/'+pic_id+'/zoom.jpg'
    to_path = 'public/pics/productpic_'+pic_id+'.png'
    require 'open-uri'
    open(to_path, 'wb') do |file|
      begin
        file << open(from_uri).read
      rescue
        puts "Error opening URL " + from_uri
      end
    end
  end

  def AlcoDrink.get_all_pics
    AlcoDrink.all.each do |drink|
      unless File.exist?('public/pics/productpic_'+drink.alko_id+'.png')
        puts 'Getting pic for '+drink.title
        #begin
          drink.get_pic
        #rescue
          #puts 'No pic found'
        #end
        puts 'Done.'
      else
        puts 'Pic exists for '+drink.title
      end
    end

  end

  def AlcoDrink.store_kimono(hash) # takes .get_kimono result and tries to store into DB
    hash.each do |row|
      # ["Otsikko", "Hinta", "Tyyppi", "Koko", "index", "url"]

      a = AlcoDrink.new

      a.title = row["Otsikko"]
      a.price = row["Hinta"].gsub!(',','.').to_f if row["Hinta"].is_a?(String)
      a.type = row["Tyyppi"]
      a.size = row["Koko"].gsub!(',','.').to_f if row["Koko"].is_a?(String)
      a.url = row["url"]

      # alko_id needs to be parsed from the url
      a.alko_id = /[0-9]+/.match(row["url"])

      a.review = Review.where(name: a.title)

      a.save # will fail if duplicate URL or title!
    end
  end

  def AlcoDrink.get_all_avails
    AlcoDrink.all.each do |drink_row|
      drink_id = drink_row.alko_id
      avails = AlcoAvail.get_for_prod(drink_id, "Helsinki")
      AlcoAvail.store_avails(drink_id, "Helsinki", avails)
    end
  end

  def AlcoDrink.set_reviews
    AlcoDrink.all.each do |drink_row|
      require 'amatch'
      include Amatch
      # fuzzy matching

      matchable = JaroWinkler.new(drink_row.title)

      best_candidate = nil
      best_score = 0.00

      Review.all.each do |row|
        if matchable.match(row.title) > 0.85
          if matchable.match(row.title) > best_score
            best_score = matchable.match(row.title)
            best_candidate = row
          end
        end
      end

      drink_row.review = best_candidate
      drink_row.best_rev_candidate_score = best_score

      if best_candidate
        drink_row.review = best_candidate
        drink_row.save!
        puts "Drink review saved for "+best_candidate.title+"!"
      else
        drink_row.review = nil
        drink_row.best_rev_candidate_score = 0.0
        drink_row.save!
        puts "No review found for "+drink_row.title+"!"
      end
    end
  end

end
