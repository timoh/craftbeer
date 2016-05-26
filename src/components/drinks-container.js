import React from 'react';
import update from 'react-addons-update';
import DrinkTableRow from '../components/drink-table-row';
import TableHeaders from '../components/table-headers';
import TableButton from '../components/table-button';
import CurrentLocation from '../current-location';
import Slider from '../components/slider';
import SearchButton from '../components/search-button';

export default class DrinksContainer extends React.Component {

  	constructor() {
  		super();
  		this.state = {
  			drinks: [],
        maxDistance: 2000
  		};
  	}
    componentWillMount() {
  		this.loadLocation(this.loadDrinksFromApi.bind(this));
    }

    loadLocation(callback) {
      var currentLoc = new CurrentLocation();
      currentLoc.getLocation(callback);
    }

    loadDrinksFromApi(position) {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      $.ajax({
          method: 'GET',
              url: '/home/distanced?lat='+latitude+'&lng='+longitude,
              dataType: 'json',
              success: function(data) {
                this.setState({drinks: data});
                this.addAdditionalDataForDrinks();
              }.bind(this)
      });
    }

    addAdditionalDataForDrinks(){
      var drinks = this.state.drinks;
      var updatedDrinks;
      drinks.map(function(drinkData,arrayIndex) {
        var score;
        if(drinkData.reviews!==undefined) {
          score=drinkData.reviews.score;
        } else {
          score ='';
        }
        var storesData = this.updateMatchesDistanceCondition(drinkData.avails);
        var maxAvailability = this.calculateMaxAvailability(drinkData.avails);
        var stocked = this.isStocked(maxAvailability);
        var updatedDrink = update(drinkData, {$merge: {score: score, maxAvailability: maxAvailability, stocked: stocked, visible:true,
          noOfStoresMatchingDistanceCondition:storesData[0], noOfNearbyStoresWithAvailability: storesData[1] }});
        updatedDrinks = this.handleArrayUpdate(arrayIndex,drinkData,updatedDrink,drinks,updatedDrinks);
      }.bind(this));
      this.setState({drinks: updatedDrinks});
    }

    updatesAfterMaxDistanceChange(){
      var drinks = this.state.drinks;
      var updatedDrinks;
      drinks.map(function(drinkData,arrayIndex) {
        var storesData = this.updateMatchesDistanceCondition(drinkData.avails);
        var maxAvailability = this.calculateMaxAvailability(drinkData.avails);
        var stocked = this.isStocked(maxAvailability);
        var updatedDrink = update(drinkData, {$merge: {maxAvailability: maxAvailability, stocked: stocked,noOfStoresMatchingDistanceCondition:storesData[0],
          noOfNearbyStoresWithAvailability: storesData[1]}});
        updatedDrinks = this.handleArrayUpdate(arrayIndex,drinkData,updatedDrink,drinks,updatedDrinks);
      }.bind(this));
      this.setState({drinks: updatedDrinks});
    }

    updateMatchesDistanceCondition(availsData) {
      var noOfStoresMatchingDistanceCondition = 0;
      var noOfNearbyStoresWithAvailability = 0;
      const maxDistance = this.state.maxDistance;
      if(availsData !== undefined) {
        availsData.map(function(availData){
          availData.matchesDistanceCondition = availData.distance_in_m <= maxDistance;
          if(availData.matchesDistanceCondition) {
              noOfStoresMatchingDistanceCondition++;
              if(availData.avail.amount > 0) {
                noOfNearbyStoresWithAvailability++;
              }
          }
        });
      }

      return [noOfStoresMatchingDistanceCondition,noOfNearbyStoresWithAvailability];
    }

    calculateMaxAvailability(availsData) {
      var maxAvailability = 0;
      if (availsData !== undefined) {
          availsData.map(function(availData){
          if(availData.matchesDistanceCondition && availData.avail.amount > maxAvailability) {
            maxAvailability = availData.avail.amount;
          }
        });
      }
      return maxAvailability;
    }

    sort(field,newSortOrder,type){
      var sortedDrinks = this.state.drinks;
      sortedDrinks.sort(this.handleSort(field,newSortOrder,type));
      this.setState({
        drinks: sortedDrinks
      });
    }

    handleSort(field,sortOrder,type) {
      if (type=="float") {
        return this.sortBy(field,sortOrder,parseFloat,true);
      } else if (type=="int") {
        return this.sortBy(field,sortOrder,parseInt,false);
      } else {
        return this.sortBy(field,sortOrder, function(a){return a.toUpperCase();}, true);
      }
    }

    sortBy(field,reverse,primer,isDrinkField){
      var key;
      if(primer) {
        if(isDrinkField) {
          key = function(x) {
            return primer(x.drink[field]);
          };
        } else {
          key = function(x) {
            return primer(x[field]);
          };
        }
      } else {
        if(isDrinkField) {
          key = function(x) {
            return x.drink[field];
          };
        } else {
          key = function(x) {
            return x[field];
          };
        }
      }
       reverse = !reverse ? 1 : -1;
       return function (a, b) {
         return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
       };
    }

    toggleNonStocked(showNonStocked) {
      var drinks = this.state.drinks;
      var updatedDrinks;
      drinks.map(function(drink,arrayIndex) {
        var visible;
        if(showNonStocked && !drink.visible) {
          visible = true;
        } else {
          visible = drink.stocked ? true : false;
        }
        var updatedDrink = update(drink, {$merge: {visible:visible}});
        updatedDrinks = this.handleArrayUpdate(arrayIndex,drink,updatedDrink,drinks,updatedDrinks);
      }.bind(this));
      this.setState({
        drinks: updatedDrinks
      });
    }

    handleArrayUpdate(arrayIndex,originalDrink,updatedDrink,originalDrinks,updatedDrinks){
      var index = originalDrinks.indexOf(originalDrink);
      if(index!=-1) {
        var arrayToUpdate;
        if (arrayIndex === 0) {
          arrayToUpdate = originalDrinks;
        } else {
          arrayToUpdate = updatedDrinks;
        }
        return update(arrayToUpdate, { $splice: [[index, 1, updatedDrink]] });
      }
    }

    isStocked(maxAvailability) {
      return maxAvailability > 0;
    }

    onSliderChange(newValue) {
      this.setState({
        maxDistance: newValue
      });
      this.updatesAfterMaxDistanceChange();
    }

    render() {
      return(
          <div>
            <div className="row">
              <div className="col-md-12">
                <Slider min="0" max="10000" step="100" value={this.state.maxDistance} onChange={this.onSliderChange.bind(this)} />
              </div>
            </div>
            <div className="row">
              <TableButton toggleNonStocked={this.toggleNonStocked.bind(this)} />
              <table className= "table table-striped table-bordered">
                <TableHeaders sort={this.sort.bind(this)} />
                <tbody>
                  { this.state.drinks.map(function(drinkData){
                    if(drinkData.visible) {
                      return (
                        <DrinkTableRow key={ drinkData.drink._id.$oid }
                        drinkData={ drinkData }/>
                      )
                    }
                  }, this)}
                </tbody>
              </table>
            </div>
            <SearchButton />
          </div>
      )
    }
}
