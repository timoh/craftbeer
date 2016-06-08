import React from 'react';
import Loader from 'react-loader';
import DrinkTableRow from '../components/drink-table-row';
import TableHeaders from '../components/table-headers';
import TableButton from '../components/table-button';
import Slider from '../components/slider';
import SearchButton from '../components/search-button';
import {connect} from 'react-redux';
import {getSelectedDrinks} from '../redux/helpers';
import { maxDistanceChange,checkedChange,showNonStockedChange,sortDrinks } from '../redux/actions';

class Drinks extends React.Component {

  	constructor(props) {
  		super(props);
  	}

    render() {
      let numberOfStoresWithSelectedDrinks;
      const keys = Object.keys(this.props.storesWithSelectedDrinks);
      if (keys === undefined) {
        numberOfStoresWithSelectedDrinks = 0;
      } else {
        numberOfStoresWithSelectedDrinks = keys.length;
      }
      const noOfSelectedDrinks = getSelectedDrinks(this.props.drinks).length;
      return(
          <div>
            <Loader loaded={this.props.loaded} className="loader">
              <div className="row">
                <div className="col-md-12">
                  <Slider min="0" max="10000" step="100" initialMaxDistance={this.props.initialMaxDistance} onChange={this.props.onSliderChange.bind(this)} />
                </div>
              </div>
              <div className="row">
                <TableButton toggleNonStocked={this.props.toggleNonStocked.bind(this)} />
                <table className= "table table-striped table-bordered">
                  <TableHeaders sort={this.props.sortDrinks.bind(this)} />
                  <tbody>
                    { this.props.drinks.map(function(drinkData){
                      if(drinkData.visible) {
                        return (
                          <DrinkTableRow key={ drinkData.drink._id.$oid }
                          drinkData={ drinkData } handleChecked = {this.props.handleChecked.bind(this)} />
                        )
                      }
                    }, this)}
                  </tbody>
                </table>
              </div>
              <SearchButton noOfSelectedDrinks = {noOfSelectedDrinks} noOfStoresWithSelectedDrinks={numberOfStoresWithSelectedDrinks} />
            </Loader>
          </div>
      )
    }
}


const mapDispatchToDrinksProps = (dispatch) => (
  {
    onSliderChange: (newValue) => (
      dispatch(maxDistanceChange(newValue))
    ),
    handleChecked: (sourceComponent) => (
      dispatch(checkedChange(sourceComponent))
    ),
    toggleNonStocked: (showNonStocked) => (
      dispatch(showNonStockedChange(showNonStocked))
    ),
    sortDrinks: (field,newSortOrder,datatype) => (
      dispatch(sortDrinks(field,newSortOrder,datatype))
    )
  }
);

const mapStateToDrinksProps = state => (
  {
    drinks: state.drinksData.drinks,
    storesWithSelectedDrinks: state.drinksData.storesWithSelectedDrinks,
    loaded: state.drinksData.loaded,
    initialMaxDistance: state.drinksData.initialMaxDistance
  }
)

const DrinksDisplay = connect(
  mapStateToDrinksProps,
  mapDispatchToDrinksProps
)(Drinks);

export default DrinksDisplay;
