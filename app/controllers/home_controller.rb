class HomeController < ApplicationController

  def index
    @drinks = AlcoDrink.where(:best_rev_candidate_score.gte => 0.85).order_by(best_rev_candidate_score: "desc")

    respond_to do |format|
        format.html
        format.json { render json: @drinks.to_json(:include => [:alco_avails, :review]) }
    end
  end

  def all_with_distance # only those with availability AND maximum 10km range
    drinks = AlcoDrink.where(:best_rev_candidate_score.gte => 0.85).order_by(best_rev_candidate_score: "desc")
    out_response = Array.new

    drinks.each do |drink|

      drink_max_avail = drink.alco_avails.max(:amount)

      # only process avails that have stock
      if drink_max_avail
        if drink_max_avail > 0

          avails_a = Array.new
          drink.alco_avails.each do |avail|

            # calculate distance in meters for location
            loc = avail.alco_location
            distance_in_m = loc.get_distance_to_point(params[:lat].to_f, params[:lng].to_f)

            # only append locations within max 10km range
            if (distance_in_m <= 10000 and avail.amount)
              if avail.amount > 0
                avails_a.append({:avail => avail,
                                 :store => avail.alco_location,
                                 :distance_in_m => distance_in_m})
              end
            else
              puts 'Omitted an avail due to too long distance'
            end

          end

          drink_hash = {:drink => drink, :avails => avails_a, :reviews => drink.review}
          out_response.append(drink_hash)

        end
      end


    end

    render :json => out_response
  end
end
