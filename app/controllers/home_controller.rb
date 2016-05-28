class HomeController < ApplicationController
  def index
    @drinks = AlcoDrink.where(:best_rev_candidate_score.gte => 0.1).order_by(best_rev_candidate_score: "desc").limit(5)

    respond_to do |format|
        format.html
        format.json { render json: @drinks.to_json(:include => [:alco_avails, :review]) }
    end
  end

  def all_with_distance
    current_location = [params[:lat], params[:lng]]
    drinks = AlcoDrink.where(:best_rev_candidate_score.gte => 0.1).order_by(best_rev_candidate_score: "desc").limit(10)

    out_response = Array.new
    # out_response = {:lat => params[:lat], :lng => params[:lng]}

    drinks.each do |drink|

      avails_a = Array.new

      drink.alco_avails.each do |avail|
        avails_a.append({:avail => avail,
                         :store => avail.alco_location,
                         :distance_in_m => avail.alco_location.get_distance_to_point(params[:lat].to_f,
                                                                                params[:lng].to_f)})
      end

      drink_hash = {:drink => drink, :avails => avails_a, :reviews => drink.review}
      out_response.append(drink_hash)
      # avails = JSON.parse(drink.alco_avails.to_json(:include => [:alco_location]))
      # review = drink.review
    end

    # render :json => {:drink => drink, :avails => avails, :review => review}
    render :json => out_response
  end
end
