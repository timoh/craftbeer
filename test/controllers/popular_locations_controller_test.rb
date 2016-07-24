require 'test_helper'

class PopularLocationsControllerTest < ActionController::TestCase
  setup do
    @popular_location = popular_locations(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:popular_locations)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create popular_location" do
    assert_difference('PopularLocation.count') do
      post :create, popular_location: { address: @popular_location.address, city: @popular_location.city, coords: @popular_location.coords }
    end

    assert_redirected_to popular_location_path(assigns(:popular_location))
  end

  test "should show popular_location" do
    get :show, id: @popular_location
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @popular_location
    assert_response :success
  end

  test "should update popular_location" do
    patch :update, id: @popular_location, popular_location: { address: @popular_location.address, city: @popular_location.city, coords: @popular_location.coords }
    assert_redirected_to popular_location_path(assigns(:popular_location))
  end

  test "should destroy popular_location" do
    assert_difference('PopularLocation.count', -1) do
      delete :destroy, id: @popular_location
    end

    assert_redirected_to popular_locations_path
  end
end
