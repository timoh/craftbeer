import React from 'react';
import Loader from 'react-loader';
import DrinkTableRow from './drink-table-row';
import TableHeaders from './table-headers';
import TableButton from './table-button';
import Slider from './slider';
import SearchButton from './search-button';
import {connect} from 'react-redux';
import { getSelectedDrinks } from '../../shared/selectors';
import { fetchDrinks, maxDistanceChange,checkedChange,showNonStockedChange,sortDrinks} from '../actions';
import { selectDrinkFromSelected } from '../../shared/actions';
import { withRouter } from 'react-router';

class Drinks extends React.Component {

  	constructor(props) {
  		super(props);
  	}

    componentWillMount() {
      // force the user to go to intropage if user loaded indexpage directly.
      if (!this.props.requested) {
          this.props.router.push('/intropage');
      } else if(this.props.shouldUpdateDrinks) {
          this.props.dispatch(fetchDrinks(false));
      }
    }

    componentWillUnmount() {
      if(this.props.drinks.length > 0) {
        const selected = getSelectedDrinks(this.props.drinks)[0];
        this.props.dispatch(selectDrinkFromSelected(selected));
      }
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
            <Loader loaded={!this.props.loading} className="loader">
              <div className="row">
                <div className="col-md-12">
                  <Slider min="0" max="10000" step="100" initialMaxDistance={this.props.initialMaxDistance} onChange={this.props.onSliderChange.bind(this)} />
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                    <div className="row margin-bottom">
                      <div className="col-md-2">
                        <TableButton toggleNonStocked={this.props.toggleNonStocked.bind(this)} />
                      </div>
                      <div className="col-md-8">
                        <SearchButton noOfSelectedDrinks = {noOfSelectedDrinks} noOfStoresWithSelectedDrinks={numberOfStoresWithSelectedDrinks} />
                      </div>
                    </div>
                    <table className= "table table-striped table-bordered">
                      <TableHeaders sort={this.props.sortDrinks.bind(this)} />
                      <tbody>
                        { this.props.drinks.map((drinkData) => {
                          if(drinkData.visible) {
                            return (
                              <DrinkTableRow key={ drinkData.drink._id.$oid }
                              drinkData={ drinkData } handleChecked = {this.props.handleChecked.bind(this)} />
                            )
                          }
                        })}
                      </tbody>
                    </table>
                </div>
              </div>
            </Loader>
          </div>
      )
    }
}

const DrinksWithRouter = withRouter(Drinks);

const mapDispatchToDrinksProps = (dispatch) => (
  {
    onSliderChange: (newValue) => (
      dispatch(maxDistanceChange(newValue))
    ),
    handleChecked: (drinkData) => (
      dispatch(checkedChange(drinkData))
    ),
    toggleNonStocked: (showNonStocked) => (
      dispatch(showNonStockedChange(showNonStocked))
    ),
    sortDrinks: (field,newSortOrder,datatype) => (
      dispatch(sortDrinks(field,newSortOrder,datatype))
    ),
    dispatch: dispatch
  }
);

const mapStateToDrinksProps = state => (
  {
    drinks: state.drinksData.drinks,
    storesWithSelectedDrinks: state.drinksData.storesWithSelectedDrinks,
    loading: state.drinksData.loading,
    initialMaxDistance: state.drinksData.initialMaxDistance,
    requested: state.positionData.requested,
    shouldUpdateDrinks: state.positionData.shouldUpdateDrinks
  }
)

const DrinksDisplay = connect(
  mapStateToDrinksProps,
  mapDispatchToDrinksProps
)(DrinksWithRouter);

export default DrinksDisplay;
