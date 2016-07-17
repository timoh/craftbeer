# CRAFTBEER

> the Craft Beer finding app for Finland, written on Rails

## Status
First deployed to Heroku, now fixing related issues.
Data collected earlier already, available in external API.

## Usage in development mode

1. `bundle install`
2. `npm install`
3. `rails s`
4. `npm start`

## To populate the data

NOTE: Requires ParseHub setup!

1. Run: `heroku run bundle exec rake populate:setup_all`

## Roadmap

* Host images in Amazon S3 or similar
* More advanced filtering of multiple locations and beer tastes
