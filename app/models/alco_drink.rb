class AlcoDrink
  include Mongoid::Document
  include Mongoid::FullTextSearch
  include Mongoid::Timestamps
  include Mongoid::Attributes::Dynamic

  field :title, type: String
  field :price, type: Float
  field :type, type: String
  field :size, type: Float
  field :url, type: String
  field :alko_id, type: String
  field :best_rev_candidate_score, type: Float # match score
  field :review_score, type: Integer # cached value of review score
  field :pic_cloudinary, type: Hash # information about picture in Cloudinary

  validates :url, uniqueness: true
  validates :title, uniqueness: true
  validates :alko_id, uniqueness: true
  validates :alko_id, presence: true

  has_many :alco_avails
  has_one :review

  before_update :populate_review_score

  fulltext_search_in :title

  def populate_review_score
    if self.review
      if self.review.score
        self.review_score = self.review.score.to_i # save the score to the parent object
        begin
          self.save! # save and check if validations pass
        rescue Exception => detail
          puts "Problem in saving review:"
          puts detail
        else
          puts "Score updated for #{self.title}: #{self.review_score}"
        end
      else
        puts "Review score does not exist, cannot update score!"
      end
    else
      puts "Review does not exist for #{self.title}"
    end
  end

  def AlcoDrink.populate_cached_review_scores
    # skip the callback
    AlcoDrink.skip_callback(:update, :before, :populate_review_score)

    AlcoDrink.all.each do |drink|
        drink.populate_review_score
    end

    # restore the callback for future calls
    AlcoDrink.set_callback(:update, :before, :populate_review_score)
  end

  def AlcoDrink.fetch_from_api(page_number=0)
    require 'rest-client'
    require 'json'
    url = "http://www.alko.fi/api/find/products?Language=fi&Page=#{page_number.to_s}&PageSize=20&ProductIds=&Query=&SingleGrape=false&Sort=0&Tags=(2872)"
    response = RestClient.get(url)
    return JSON.parse(response)
  end

  def AlcoDrink.fetch_all_from_api
    counter = 0
    final_response = []

    loop do
        res = AlcoDrink.fetch_from_api(counter)
        final_response = final_response + res["Results"]
      counter = counter+1
      break unless res["HasMoreResults"]
    end

    return final_response
  end

  def AlcoDrink.store_all_from_api
    begin
      reponse = AlcoDrink.fetch_all_from_api

      reponse.each do |row|
        begin
          a = AlcoDrink.new

          a.title = row["Name"]
          a.price = row["Price"].gsub!(',','.').to_f if row["Price"].is_a?(String)
          a.type = row["TasteSymbol"]["Name"]
          a.size = row["Volume"].gsub!(',','.').to_f if row["Volume"].is_a?(String)
          a.url = "http://www.alko.fi/tuotteet/#{row["ProductId"]}"
          a.alko_id = row["ProductId"]

          a.review = Review.where(name: a.title)

          a.save! # will fail if duplicate URL or title!
        rescue Exception => detail
          puts "Storing drink failed"
          puts "Reason: \n\n ---- "
          puts detail
          puts " ----- \n\n "
        end
      end

    rescue Exception  => detail
      puts "Storing drinks failed!"
      puts "Reason: \n\n ---- "
      puts detail
      puts " ----- \n\n "
    else
      puts "Storing all Alko Beers successful!"
    end
  end

  def get_pic
    require 'json'
    pic_id = self.alko_id
    from_uri = 'http://cdn.alko.fi/ProductImages/Scaled/'+pic_id+'/zoom.jpg'

    begin
      # use Cloudinary to upload the file
      out_hash = Cloudinary::Uploader.upload(from_uri)
      #out_hash = JSON.parse(response)
      self.pic_cloudinary = out_hash
    rescue Exception => detail
      puts "Failed to fetch pic for #{self.title}!"
      puts "Reason:"
      puts detail
    else
      # .. and then store the information regarding the file into Mongo
      self.save
    end

  end

  def AlcoDrink.get_all_pics
    # skip the callback
    AlcoDrink.skip_callback(:update, :before, :populate_review_score)

    AlcoDrink.all.each do |drink|
      unless drink.pic_cloudinary
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

    # restore the callback for future calls
    AlcoDrink.set_callback(:update, :before, :populate_review_score)
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

  def AlcoDrink.all_with_distance(lat, lng, page_number=1, sort_column="title", sort_order="desc") # only those with availability AND maximum 10km range
    drinks = AlcoDrink.where(:best_rev_candidate_score.gte => 0.85).order_by([sort_column, sort_order]).page(page_number)

    out_response = Array.new
    drinks.includes(:alco_avails).each do |drink|

      if drink.review
        drink_max_avail = drink.alco_avails.max(:amount)

        # only process avails that have stock
        if drink_max_avail
          if drink_max_avail > 0

            avails_a = Array.new
            drink.alco_avails.includes(:alco_location).each do |avail|

              # calculate distance in meters for location
              loc = avail.alco_location
              distance_in_m = loc.get_distance_to_point(lat, lng)

              # only append locations within max 10km range
              if (distance_in_m <= 10000 and avail.amount)
                if avail.amount > 0
                  avails_a.append({:avail => avail,
                                   :store => avail.alco_location,
                                   :distance_in_m => distance_in_m})
                end
              else
                puts 'Omitted an avail due to too long distance'
              end

            end

            drink_hash = {:drink => drink, :avails => avails_a, :reviews => drink.review}
            out_response.append(drink_hash)

          end
        end


      end
    end

    return out_response
  end

end
