require 'test_helper'

class GeocodeControllerTest < ActionController::TestCase
  test "should get forward" do
    get :forward
    assert_response :success
  end

  test "should get backward" do
    get :backward
    assert_response :success
  end

end
