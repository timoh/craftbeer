import React from 'react';
import update from 'react-addons-update';
import DrinkTableRow from '../components/drink-table-row';
import TableHeader from '../components/table-header';
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
                this.state.drinks.map(function(drink){
                    this.loadAdditionalDataForDrink(drink);
                }.bind(this))
              }.bind(this)
      })

    }

    getDrinkIndex(drink) {
  		return this.state.drinks.map(function(drinkInState)
          {
            return drinkInState._id.$oid;
          }).indexOf(drink._id.$oid);
  	}

    loadAdditionalDataForDrink(drink){
      var id = drink._id.$oid;
      $.ajax({
          method: 'GET',
              url: 'alco_drinks/broad/' + id,
              dataType: 'json',
              success: function(data) {
                this.updateDrink(data);
              }.bind(this)
      })
    }

    updateDrink(drinkData) {
      if(drinkData.review!=undefined) {
        drinkData.score=drinkData.review.score;
      } else {
        drinkData.score ='';
      }
      drinkData.maxAvailability = this.calculateMaxAvailability(drinkData.alco_avails);
      var index = this.getDrinkIndex(drinkData);
      if(index!=-1) {
      		var updatedDrinks =  update(this.state.drinks, { $splice: [[index, 1, drinkData]] });
      		this.setState({drinks: updatedDrinks});
      }
    }

    calculateMaxAvailability(alco_avails) {
      var maxAvailability = 0;
      if (alco_avails !=undefined) {
          alco_avails.map(function(alco_avail){
          if(alco_avail.amount > maxAvailability) {
            maxAvailability = alco_avail.amount;
          }
        });
      }
      return maxAvailability;
    }


    sort(field){
      var sortedDrinks = this.state.drinks;
      sortedDrinks.sort(this.handleSort(field));
      this.setState({
        drinks: sortedDrinks
      });
    }
    handleSort(field) {
      if (field=='price' || field =='size') {
        return this.sortBy(field,false,parseFloat);
      } else if (field=='best_rev_candidate_score'){
        return this.sortBy(field,true,parseFloat);
      } else if (field=='maxAvailability' || field=='score') {
        return this.sortBy(field,true,parseInt);
      } else {
        return this.sortBy(field,false, function(a){return a.toUpperCase()});
      }
    }

    sortBy(field,reverse,primer){

      var key = primer ?
       function(x) {return primer(x[field])} :
       function(x) {return x[field]};

       reverse = !reverse ? 1 : -1;

       return function (a, b) {
         return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
       }
    }


  render() {
    return(
        <table className= "table table-striped table-bordered">
          <TableHeader sort={this.sort.bind(this)} />
          <tbody>
            { this.state.drinks.map(function(drink){
              return (
                <DrinkTableRow key={ drink._id.$oid }
                drink={ drink }/>
              )
            }, this)}
          </tbody>
        </table>
    )
  }
}
