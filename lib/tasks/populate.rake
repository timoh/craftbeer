namespace :populate do


  desc "Populate the database with review data"
  task review_data: :environment do
    Review.store_kimono(Review.get_kimono)
    puts "Review data successfully populated!"
  end

  desc "Populate the DB with Alko product data"
  task alko_product: :environment do
    AlcoDrink.store_kimono(AlcoDrink.get_kimono)
    puts "Alko product data successfully populated!"
  end

  desc "Populate the DB with Alko availability data"
  task alko_avail: :environment do
    AlcoDrink.get_all_avails
    puts "Alko availability data successfully populated!"
  end

  desc "Populate the DB with Alko location data"
  task alko_locs: :environment do
    AlcoLocation.populate_location_data
    puts "Alko location data successfully populated!"
  end

  desc "Match the reviews with Alko data"
  task fuzzymatch: :environment do
    AlcoDrink.set_reviews
    puts "Review data matched successfully with Alko data!"
  end

  desc "Purge whole DB"
  task purge_db: :environment do
    AlcoAvail.delete_all
    AlcoDrink.delete_all
    AlcoLocation.delete_all
    Review.delete_all
    puts "DB now purged!"
  end

  desc "Empty DB collections and do all population tasks sequentially"
  task whole_shebang: :environment do
    Rake::Task["populate:purge_db"].invoke
    Rake::Task["populate:review_data"].invoke
    Rake::Task["populate:alko_product"].invoke
    Rake::Task["populate:alko_avail"].invoke
    Rake::Task["populate:fuzzymatch"].invoke
    puts "Whole shebang complete!"
  end

  desc "Get big images from CDN"
  task pics: :environment do
    AlcoDrink.get_all_pics
    puts "All pics fetched"
  end

end
