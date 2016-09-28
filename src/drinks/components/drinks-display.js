import React from 'react';
import DrinkTableRow from './drink-table-row';
import TableHeaders from './table-headers';
import TableButtonDisplay from './table-button';
import SearchFilterDisplay from './search-filter';
import Slider from './slider';
import SearchButton from './search-button';
import {connect} from 'react-redux';
import { getSelectedDrinks, getVisibleDrinks } from '../../shared/selectors';
import { fetchDrinks, maxDistanceChange,checkedChange,showNonStockedChange,runSortDrinks} from '../actions';
import { selectDrinkFromSelected } from '../../shared/actions';
import { withRouter } from 'react-router';
import Infinite from 'react-infinite';
import { normalScreenWidth } from '../../shared/helpers';

class Drinks extends React.Component {

  	constructor(props) {
  		super(props);
  	}

    componentWillMount() {
      // force the user to go to intropage if user loaded indexpage directly.
      if (!this.props.requested) {
          this.props.router.push('/intropage');
      } else if(this.props.shouldUpdateDrinks) {
          this.props.dispatch(fetchDrinks(1, false, true));
      }
    }

    componentWillUnmount() {
      if(this.props.drinks.length > 0) {
        const selected = getSelectedDrinks(this.props.drinks)[0];
        this.props.dispatch(selectDrinkFromSelected(selected));
      }
    }

    elementInfiniteLoad() {
        return (
          <div></div>
        )
    }

    handleInfiniteLoad() {
      // if there are no visible drinks, it should not load anything, because if it does, that will result in a never-ending loop.
      // cursor will always be at the end of the table --> it would load more drinks.
      // stopLoadingDrinks is true when the last request returned zero drinks.
      // when filter is on, it should not load more drinks.
      const shouldInfiniteLoad = getVisibleDrinks(this.props.drinks).length > 0 && !this.props.stopLoadingDrinks && !this.props.isInfiniteLoading && !this.props.loading && !this.props.filterOn

      if (shouldInfiniteLoad) {
        this.props.dispatch(fetchDrinks(this.props.pagesLoaded + 1, true, false));
      }
    }

    dispatchRunSortDrinks(field,newSortOrder,datatype) {
      this.props.dispatch(runSortDrinks(field,newSortOrder,datatype,this.props.stopLoadingDrinks, this.props.filterOn));
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
      const visibleDrinks = getVisibleDrinks(this.props.drinks);
      let spinner;
      if (this.props.loading || this.props.isInfiniteLoading) {
        spinner = (
          <div className="loading">Loading...</div>
        )
      }
      let spinnerText;
      if (this.props.loading) {
        spinnerText = "Loading drinks...";
      } else if (this.props.isInfiniteLoading) {
        spinnerText = "Loading more drinks...";
      }
      let spinnerTextElement;
      if (this.props.loading || this.props.isInfiniteLoading) {
        spinnerTextElement = (
          <div className="spinnertext">{spinnerText}</div>
        )
      }
      let elementHeight;
      if (normalScreenWidth()) {
        elementHeight = 80;
      } else {
        elementHeight = 92;
      }

      //TODO fix infiniteLoadBeginEdgeOffset when using mobile on portrait view. Otherwise it works quite OK now.

      return(
          <div>
              {spinner}
              {spinnerTextElement}
              <div className="row">
                <div className="col-md-12 col-xs-12">
                  <Slider min="0" max="10000" step="100" initialMaxDistance={this.props.initialMaxDistance} onChange={this.props.onSliderChange.bind(this)} />
                </div>
              </div>
              <div className="row">
                <div className="col-md-12 col-xs-12">
                    <div className="row margin-bottom">
                      <div className="col-md-6 col-xs-8">
                        <SearchFilterDisplay />
                      </div>
                      <div className="col-md-4 col-xs-4">
                        <TableButtonDisplay toggleNonStocked={this.props.toggleNonStocked.bind(this)} />
                      </div>
                    </div>
                    <div className= "div-table table">
                      <Infinite elementHeight={elementHeight}
                                infiniteLoadBeginEdgeOffset={-400}
                                onInfiniteLoad={this.handleInfiniteLoad.bind(this)}
                                loadingSpinnerDelegate={this.elementInfiniteLoad()}
                                isInfiniteLoading={this.props.isInfiniteLoading}
                                className="div-table-rows"
                                useWindowAsScrollContainer
                                preloadBatchSize={Infinite.containerHeightScaleFactor(100)}
                                preloadAdditionalHeight={Infinite.containerHeightScaleFactor(100)}>
                        <TableHeaders sort={this.dispatchRunSortDrinks.bind(this)} headers={this.props.headers} />
                        { visibleDrinks.map((drinkData) => {
                            return (
                              <DrinkTableRow key={ drinkData.drink._id.$oid }
                              drinkData={ drinkData } handleChecked = {this.props.handleChecked.bind(this)} />
                            )
                        })}
                        </Infinite>
                    </div>
                    <SearchButton noOfSelectedDrinks = {noOfSelectedDrinks} noOfVisibleDrinks={visibleDrinks.length} noOfStoresWithSelectedDrinks={numberOfStoresWithSelectedDrinks} />
                </div>
              </div>
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
    ),/*
    runSortDrinks: (field,newSortOrder,datatype,stopLoadingDrinks) => (
      dispatch(runSortDrinks(field,newSortOrder,datatype, stopLoadingDrinks))
    ),*/
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
    shouldUpdateDrinks: state.positionData.shouldUpdateDrinks,
    isInfiniteLoading: state.drinksData.isInfiniteLoading,
    pagesLoaded: state.drinksData.pagesLoaded,
    stopLoadingDrinks: state.drinksData.stopLoadingDrinks,
    headers: state.drinksData.tableHeaders,
    filterOn: state.drinksData.filterOn
  }
)

const DrinksDisplay = connect(
  mapStateToDrinksProps,
  mapDispatchToDrinksProps
)(DrinksWithRouter);

export default DrinksDisplay;
