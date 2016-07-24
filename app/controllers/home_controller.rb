class HomeController < ApplicationController

  def index
    @drinks = AlcoDrink.where(:best_rev_candidate_score.gte => 0.85).order_by(best_rev_candidate_score: "desc")

    respond_to do |format|
        format.html
        format.json { render json: @drinks.to_json(:include => [:alco_avails, :review]) }
    end
  end

  def all_with_distance # only those with availability AND maximum 10km range

    if params[:lat] && params[:lng]

      lat = params[:lat].to_f
      lng = params[:lng].to_f

      page = 1 # initialize page to first page as default, for pagination
      page = params[:page].gsub(/[^0-9]/, '') if params[:page] # if params[:page] set, use it

      sort_column = "title"
      sort_column = params[:sort_column].gsub(/[^0-9A-Za-z]/, '') if params[:sort_column]
      sort_order = "desc"
      sort_order = params[:sort_order].gsub(/[^0-9A-Za-z]/, '') if params[:sort_order]

      filter = ''
      filter = params[:filter].gsub(/[^0-9A-Za-z]/, ' ') if params[:filter]

      out_response = AlcoDrink.all_with_distance(lat, lng, page, sort_column, sort_order, filter)
      render :json => out_response

    else
      render :json => {:error => { :message => "You need to supply lat & lng parameters as floats!" }}
    end
  end
end
