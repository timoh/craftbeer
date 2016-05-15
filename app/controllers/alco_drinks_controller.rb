class AlcoDrinksController < ApplicationController
  before_action :set_alco_drink, only: [:show, :edit, :update, :destroy, :show_broad_json]

  # GET /alco_drinks
  # GET /alco_drinks.json
  def index
    @alco_drinks = AlcoDrink.all
  end

  # GET /alco_drinks/1
  # GET /alco_drinks/1.json
  def show
  end

  def show_broad_json
    render :json => @alco_drink.to_json(:include => [:alco_avails, :review])
  end

  # GET /alco_drinks/new
  def new
    @alco_drink = AlcoDrink.new
  end

  # GET /alco_drinks/1/edit
  def edit
  end

  # POST /alco_drinks
  # POST /alco_drinks.json
  def create
    @alco_drink = AlcoDrink.new(alco_drink_params)

    respond_to do |format|
      if @alco_drink.save
        format.html { redirect_to @alco_drink, notice: 'Alco drink was successfully created.' }
        format.json { render :show, status: :created, location: @alco_drink }
      else
        format.html { render :new }
        format.json { render json: @alco_drink.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /alco_drinks/1
  # PATCH/PUT /alco_drinks/1.json
  def update
    respond_to do |format|
      if @alco_drink.update(alco_drink_params)
        format.html { redirect_to @alco_drink, notice: 'Alco drink was successfully updated.' }
        format.json { render :show, status: :ok, location: @alco_drink }
      else
        format.html { render :edit }
        format.json { render json: @alco_drink.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /alco_drinks/1
  # DELETE /alco_drinks/1.json
  def destroy
    @alco_drink.destroy
    respond_to do |format|
      format.html { redirect_to alco_drinks_url, notice: 'Alco drink was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_alco_drink
      @alco_drink = AlcoDrink.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def alco_drink_params
      params.require(:alco_drink).permit(:title, :price, :type, :size, :url)
    end
end
