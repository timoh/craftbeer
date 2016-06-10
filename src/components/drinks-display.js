import React from 'react';
import Loader from 'react-loader';
import DrinkTableRow from '../components/drink-table-row';
import HeadersDisplay from '../components/table-headers';
import TableButton from '../components/table-button';
import Slider from '../components/slider';
import SearchButton from '../components/search-button';
import {connect} from 'react-redux';
import {getSelectedDrinks} from '../redux/helpers';
import { maxDistanceChange,checkedChange,showNonStockedChange,sortDrinks } from '../redux/actions';
import { withRouter } from 'react-router';

class Drinks extends React.Component {

  	constructor(props) {
  		super(props);
  	}

    componentWillMount() {
      // force the user to go to intropage if user loaded indexpage directly.
      if(!this.props.loading && this.props.drinks.length === 0) {
        this.props.router.push('/intropage');
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
                <TableButton toggleNonStocked={this.props.toggleNonStocked.bind(this)} />
                <table className= "table table-striped table-bordered">
                  <HeadersDisplay sort={this.props.sortDrinks.bind(this)} />
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
              <SearchButton noOfSelectedDrinks = {noOfSelectedDrinks} noOfStoresWithSelectedDrinks={numberOfStoresWithSelectedDrinks} />
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
    loading: state.drinksData.loading,
    initialMaxDistance: state.drinksData.initialMaxDistance
  }
)

const DrinksDisplay = connect(
  mapStateToDrinksProps,
  mapDispatchToDrinksProps
)(DrinksWithRouter);

export default DrinksDisplay;
