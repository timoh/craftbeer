class GeocodeController < ApplicationController
  protect_from_forgery with: :null_session
  skip_before_filter  :verify_authenticity_token

  def forward
    address = params[:address]
    render :json => Geocoder.geocode(address, "FI")
  end

  def backward # lat=60.1616054,lng=24.8814315
    lat = params[:latitude].to_f
    lng = params[:longitude].to_f
    render :json => Geocoder.reverse_geocode(lat, lng)
  end

  def address
    # action for sending address with browser
  end

  def coords
    # action for sending coordinatesess with browser
  end

end
