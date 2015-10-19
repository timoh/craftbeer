class HomeController < ApplicationController
  def index
    @drinks = AlcoDrink.where(:best_rev_candidate_score.gte => 0.1).order_by(best_rev_candidate_score: "desc")
  end
end
