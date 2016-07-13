class HomeController < ApplicationController

  def index
    @drinks = AlcoDrink.where(:best_rev_candidate_score.gte => 0.85).order_by(best_rev_candidate_score: "desc")

    respond_to do |format|
        format.html
        format.json { render json: @drinks.to_json(:include => [:alco_avails, :review]) }
    end
  end

  def all_with_distance # only those with availability AND maximum 10km range
    page = 1 # initialize page to first page as default, for pagination
    page = params[:page] if params[:page] # if params[:page] set, use it
    out_response = AlcoDrink.all_with_distance(params[:lat].to_f, params[:lng].to_f, page)
    render :json => out_response
  end
end
