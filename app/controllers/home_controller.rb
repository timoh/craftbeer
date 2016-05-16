class HomeController < ApplicationController
  def index
    @drinks = AlcoDrink.where(:best_rev_candidate_score.gte => 0.1).order_by(best_rev_candidate_score: "desc")

    respond_to do |format|
        format.html
        format.json { render json: @drinks.to_json(:include => [:alco_avails, :review]) }
    end
  end
end
