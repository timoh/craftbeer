class HomeController < ApplicationController
  def index
    @drinks = AlcoDrink.where(:best_rev_candidate_score.gte => 0.1).order_by(best_rev_candidate_score: "desc")

    respond_to do |format|
        format.html
        format.json { render json: @drinks.to_json(:include => [:alco_avails, :review]) }
    end
  end

  def all_with_distance
    current_location = [params[:lat], params[:lng]]
    drinks = AlcoDrink.where(:best_rev_candidate_score.gte => 0.1).order_by(best_rev_candidate_score: "desc")

    out_response = Hash.new
    out_response = {:lat => params[:lat], :lng => params[:lng]}

    # drinks.each do |drink|
    #   avails = JSON.parse(drink.alco_avails.to_json(:include => [:alco_location]))
    #   review = drink.review
    # end

    # render :json => {:drink => drink, :avails => avails, :review => review}
    render :json => out_response
  end
end
