source 'https://rubygems.org'
# ruby version is determined in the .ruby-version file

# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem "config"
gem "amatch"
# fuzzymatching of drinks and reviews

gem 'rails', '4.2.4'
gem 'mongoid', '~> 5.0.0'
gem 'rest-client'
# Use SCSS for stylesheets
gem 'sass-rails', '~> 5.0'

gem 'puma' # webserver for production use

gem 'mongoid-geospatial'
# for geolocation stuff

gem 'mongoid_fulltext'
# for fulltext search and filtering

gem 'georuby'
# used for distance calculations

gem 'kaminari'
# used for API pagination

gem 'carrierwave'
# used for storing images in Cloudinary

gem 'cloudinary'
# load carrierwave before Cloudinary

gem 'libv8'

gem "therubyracer"
gem "less-rails" #Sprockets (what Rails 3.1 uses for its asset pipeline) supports LESS
gem "twitter-bootstrap-rails"
gem 'bootstrap-generators'
gem 'slim-rails'

# Use Uglifier as compressor for JavaScript assets
gem 'uglifier', '>= 1.3.0'
# Use CoffeeScript for .coffee assets and views
gem 'coffee-rails', '~> 4.1.0'
# See https://github.com/rails/execjs#readme for more supported runtimes
# gem 'therubyracer', platforms: :ruby

# Use jquery as the JavaScript library
gem 'jquery-rails'
# Turbolinks makes following links in your web application faster. Read more: https://github.com/rails/turbolinks
gem 'turbolinks'
# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
gem 'jbuilder', '~> 2.0'
# bundle exec rake doc:rails generates the API under doc/api.
gem 'sdoc', '~> 0.4.0', group: :doc

# Use ActiveModel has_secure_password
# gem 'bcrypt', '~> 3.1.7'

# Use Unicorn as the app server
# gem 'unicorn'

# Use Capistrano for deployment
# gem 'capistrano-rails', group: :development

group :development, :test do
  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  gem 'byebug'
end

group :development do
  gem 'awesome_print', :require => 'ap'
  gem 'pry-rails', :group => :development
  # gem 'jazz_hands' # --> does not work with Ruby 2 due to PRY Debugger
  # Access an IRB console on exception pages or by using <%= console %> in views
  gem 'web-console', '~> 2.0'

  # Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
  gem 'spring'
end

group :production do
  # Include 'rails_12factor' gem to enable all platform features
  # See https://devcenter.heroku.com/articles/rails-integration-gems for more information.
  gem 'rails_12factor'
end
