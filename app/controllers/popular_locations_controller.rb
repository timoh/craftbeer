class PopularLocationsController < ApplicationController
  before_action :set_popular_location, only: [:show, :edit, :update, :destroy]

  # GET /popular_locations
  # GET /popular_locations.json
  def index
    @popular_locations = PopularLocation.all
    @top_locations = PopularLocation.get_top
  end

  # GET /popular_locations/1
  # GET /popular_locations/1.json
  def show
  end

  # GET /popular_locations/new
  def new
    @popular_location = PopularLocation.new
  end

  # GET /popular_locations/1/edit
  def edit
  end

  # POST /popular_locations
  # POST /popular_locations.json
  def create
    @popular_location = PopularLocation.new(popular_location_params)

    respond_to do |format|
      if @popular_location.save
        format.html { redirect_to @popular_location, notice: 'Popular location was successfully created.' }
        format.json { render :show, status: :created, location: @popular_location }
      else
        format.html { render :new }
        format.json { render json: @popular_location.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /popular_locations/1
  # PATCH/PUT /popular_locations/1.json
  def update
    respond_to do |format|
      if @popular_location.update(popular_location_params)
        format.html { redirect_to @popular_location, notice: 'Popular location was successfully updated.' }
        format.json { render :show, status: :ok, location: @popular_location }
      else
        format.html { render :edit }
        format.json { render json: @popular_location.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /popular_locations/1
  # DELETE /popular_locations/1.json
  def destroy
    @popular_location.destroy
    respond_to do |format|
      format.html { redirect_to popular_locations_url, notice: 'Popular location was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_popular_location
      @popular_location = PopularLocation.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def popular_location_params
      params.require(:popular_location).permit(:address, :city, :coords)
    end
end
