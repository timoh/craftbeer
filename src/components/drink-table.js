import React from 'react';
import update from 'react-addons-update';
import DrinkTableRow from '../components/drink-table-row';
import TableHeaders from '../components/table-headers';
import TableButton from '../components/table-button';
export default class DrinkTable extends React.Component {

  	constructor() {
  		super();
  		this.state = {
  			drinks: []
  		};
  	}
    componentWillMount() {
  		this.loadDrinksFromApi();
    }

    loadDrinksFromApi() {
      $.ajax({
          method: 'GET',
              url: '/home/index',
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
      drinks.map(function(drink,arrayIndex) {
        var score;
        if(drink.review!==undefined) {
          score=drink.review.score;
        } else {
          score ='';
        }
        var maxAvailability = this.calculateMaxAvailability(drink.alco_avails);
        var stocked = this.isStocked(maxAvailability);
        var updatedDrink = update(drink, {$merge: {score: score, maxAvailability: maxAvailability, stocked: stocked, visible:true}});
        updatedDrinks = this.handleArrayUpdate(arrayIndex,drink,updatedDrink,drinks,updatedDrinks);
      }.bind(this));
      this.setState({drinks: updatedDrinks});
    }

    calculateMaxAvailability(alco_avails) {
      var maxAvailability = 0;
      if (alco_avails !==undefined) {
          alco_avails.map(function(alco_avail){
          if(alco_avail.amount > maxAvailability) {
            maxAvailability = alco_avail.amount;
          }
        });
      }
      return maxAvailability;
    }

    sort(field,newSortOrder){
      var sortedDrinks = this.state.drinks;
      sortedDrinks.sort(this.handleSort(field,newSortOrder));
      this.setState({
        drinks: sortedDrinks
      });
    }

    handleSort(field,sortOrder) {
      if (field=='price' || field =='size') {
        return this.sortBy(field,sortOrder,parseFloat);
      } else if (field=='best_rev_candidate_score'){
        return this.sortBy(field,sortOrder,parseFloat);
      } else if (field=='maxAvailability' || field=='score') {
        return this.sortBy(field,sortOrder,parseInt);
      } else {
        return this.sortBy(field,sortOrder, function(a){return a.toUpperCase();});
      }
    }

    sortBy(field,reverse,primer){
      var key = primer ?
       function(x) {return primer(x[field]);} :
       function(x) {return x[field];};

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
          if(drink.stocked) {
            visible = true;
          } else {
            visible = false;
          }
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

    render() {
      return(
          <div>
            <TableButton toggleNonStocked={this.toggleNonStocked.bind(this)}/>
            <table className= "table table-striped table-bordered">
              <TableHeaders sort={this.sort.bind(this)} />
              <tbody>
                { this.state.drinks.map(function(drink){
                  if(drink.visible) {
                    return (
                      <DrinkTableRow key={ drink._id.$oid }
                      drink={ drink }/>
                    )
                  }
                }, this)}
              </tbody>
            </table>
          </div>
      )
    }
}
