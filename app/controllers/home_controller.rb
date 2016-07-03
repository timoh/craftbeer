class HomeController < ApplicationController

  def index
    @drinks = AlcoDrink.where(:best_rev_candidate_score.gte => 0.85).order_by(best_rev_candidate_score: "desc")

    respond_to do |format|
        format.html
        format.json { render json: @drinks.to_json(:include => [:alco_avails, :review]) }
    end
  end

  def all_with_distance # only those with availability AND maximum 10km range
    out_response = AlcoDrink.all_with_distance(params[:lat].to_f, params[:lng].to_f)
    render :json => out_response
  end
end
