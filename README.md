# CRAFTBEER

> the Craft Beer finding app for Finland, written on Rails

## Status
Just started this project.
Data collected earlier already, available in external API.

## Usage in development mode

1. `bundle install`
2. `npm install`
3. `rails s`
4. `npm start`

## To populate the data

1. To get drink and review data ... that's broken ATM (will fix, TODO)
  * `bundle exec rake populate:review_data`
  * `bundle exec rake populate:alko_product`
2. Then, populate:
  * `bundle exec rake populate:alko_avail`
  * `bundle exec rake populate:alko_locs`

## Roadmap

1. Ingest data from ext. api
2. Cross-reference Reviews and pricing & availability information to only show available beers
3. Ask for user's favorite place and only show availability of beers there
4. More advanced filtering of multiple locations and beer tastes
