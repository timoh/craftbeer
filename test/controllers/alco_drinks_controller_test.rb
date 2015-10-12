require 'test_helper'

class AlcoDrinksControllerTest < ActionController::TestCase
  setup do
    @alco_drink = alco_drinks(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:alco_drinks)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create alco_drink" do
    assert_difference('AlcoDrink.count') do
      post :create, alco_drink: { price: @alco_drink.price, size: @alco_drink.size, title: @alco_drink.title, type: @alco_drink.type, url: @alco_drink.url }
    end

    assert_redirected_to alco_drink_path(assigns(:alco_drink))
  end

  test "should show alco_drink" do
    get :show, id: @alco_drink
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @alco_drink
    assert_response :success
  end

  test "should update alco_drink" do
    patch :update, id: @alco_drink, alco_drink: { price: @alco_drink.price, size: @alco_drink.size, title: @alco_drink.title, type: @alco_drink.type, url: @alco_drink.url }
    assert_redirected_to alco_drink_path(assigns(:alco_drink))
  end

  test "should destroy alco_drink" do
    assert_difference('AlcoDrink.count', -1) do
      delete :destroy, id: @alco_drink
    end

    assert_redirected_to alco_drinks_path
  end
end
