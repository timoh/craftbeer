class PopularLocation
  include Mongoid::Document
  include Mongoid::Timestamps
  include Mongoid::Geospatial
  include Mongoid::FullTextSearch

  field :address, type: String
  field :city, type: String # not used at this point
  field :coords, type: Point
  field :count, type: Integer, default: 0

  fulltext_search_in :address, :city

  def PopularLocation.reset_counts
    PopularLocation.all.each do |location|
      location.count = 0
      location.save
    end
  end

  def PopularLocation.populate
    PopularLocation.reset_counts

    AddressQuery.all.each do |adr_query|
      puts "Creating new row for: #{adr_query.query}"
      loc = PopularLocation.find_or_create_by(:address => adr_query.query)
      loc.count += 1
      loc.coords = adr_query.coords
      loc.city = adr_query.city if adr_query.city
      loc.save
    end
    puts "Populating popular locations complete!"
  end

  def PopularLocation.get_top
    # max = PopularLocation.max(:count)
    # min = PopularLocation.min(:count)
    avg = PopularLocation.avg(:count)

    return PopularLocation.all.where(:count.gte => avg).order_by(count: "desc").limit(5)
  end

end
