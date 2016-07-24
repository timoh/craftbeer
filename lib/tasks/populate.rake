namespace :populate do


  desc "Populate the database with review data"
  task review_data: :environment do
    puts "Starting to fetch Review data!"
    Review.store_parsehub
    puts "Review data successfully populated!"
  end

  desc "Populate the DB with Alko product data"
  task alko_product: :environment do
    puts "Starting to populate product data through API, this might take a while..."
    AlcoDrink.store_all_from_api
    AlcoDrink.populate_cached_review_scores
    puts "Alko product data successfully populated!"
  end

  desc "Populate the DB with Alko location data"
  task alko_locs: :environment do
    AlcoLocation.populate_location_data
    puts "Alko location data successfully populated!"
  end

  desc "Populate the DB with Alko availability data"
  task alko_avail: :environment do
    AlcoDrink.get_all_avails
    puts "Alko availability data successfully populated!"
  end

  desc "De-duplicate availability data"
  task dedupe_avails: :environment do
    AlcoLocation.dedupe_all_avails
    puts "Availability data successfully de-duplicated!"
  end

  desc "Fetch AND deduplicate availability data"
  task avail_fetch_dedupe: :environment do
      Rake::Task["populate:alko_avail"].invoke
      Rake::Task["populate:dedupe_avails"].invoke
      puts "Fetch AND deduplicate availability data done!"
  end

  desc "Match the reviews with Alko data"
  task fuzzymatch: :environment do
    AlcoDrink.set_reviews
    puts "Review data matched successfully with Alko data!"
  end

  desc "Get big images from CDN"
  task pics: :environment do
    begin
      Dir.mkdir 'public/pics'
    rescue
      puts "Could not create public/pics folder!"
    end
    AlcoDrink.get_all_pics
    puts "All pics fetched"
  end

  desc "Populate full text search indexes"
  task fulltext_indexes: :environment do
    Rake::Task["db:mongoid:create_indexes"].invoke
    AlcoDrink.update_ngram_index
  end

  desc "Run all setup activities at onece"
  task setup_all: :environment do
      puts "Starting initial setup.."
      Rake::Task["populate:review_data"].invoke
      Rake::Task["populate:alko_product"].invoke
      Rake::Task["populate:alko_locs"].invoke
      Rake::Task["populate:alko_avail"].invoke
      Rake::Task["populate:dedupe_avails"].invoke
      Rake::Task["populate:fuzzymatch"].invoke
      Rake::Task["populate:pics"].invoke
      Rake::Task["populate:fulltext_indexes"].invoke
      puts "Initial setup done, ready to rock and roll!"
  end

  # Auxiliary tasks

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

end
