class AlcoAvail
  include Mongoid::Document
  include Mongoid::Timestamps
  field :amount, type: Integer
  field :last_updated, type: Date

  belongs_to :alco_location
  belongs_to :alco_drink

  validates :amount, presence: true

  def AlcoAvail.get_for_prod(prod_id='781706', city='helsinki')
    require 'net/http'
    require 'json'

    base_url = "http://www.alko.fi/api/product/Availability?productId="+prod_id+"&cityId="+city+"&language=fi"

    url = URI.parse(base_url)
    req = Net::HTTP::Get.new(url.to_s)
    res = Net::HTTP.start(url.host, url.port) {|http|
      http.request(req)
    }
    return JSON.parse(res.body)
  end

  def AlcoAvail.store_avails(prod_id, city, res_json)
    # find product (drink) that the availability is related to
    drink = AlcoDrink.where(alko_id: prod_id).first
    raise 'Drink not found! Cannot create availability for product that doesnt exist!' unless drink.title.size > 0

    res_json.each do |res_loc|
      # for each location, create a new availability info
      av = AlcoAvail.new
      av.alco_drink = drink

      loc_obj = AlcoLocation.find_or_create_by(loc_name: res_loc["StoreName"])
      loc_obj.city = city

      # also add the store_link at this point, so that it can be used for
      # getting the address of the store later
      loc_obj.store_link = res_loc["StoreLink"]

      loc_obj.save!

      av.alco_location = loc_obj

      av.amount = res_loc["Amount"]
      final_date = ""
      # format of data is "LastUpdated" => "17.10.", but might also be "eilen" or "2015-10-19"!
      # target is: strptime("17.10.2015", "%d.%m.%Y")
      if res_loc["LastUpdated"] == "eilen"
        final_date = Date.today-1
      elsif res_loc["LastUpdated"].include? "-"
        final_date = res_loc["LastUpdated"]
        puts final_date
        av.last_updated = Date.strptime(res_loc["LastUpdated"], "%Y-%m-%d")
      else
        final_date = res_loc["LastUpdated"]+(Date.today.year.to_s)
        puts final_date
        av.last_updated = Date.strptime(final_date, "%d.%m.%Y")
      end




      puts av

      # now we should be done!
      av.save!
    end

  end

end
