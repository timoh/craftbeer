import React from 'react';
import Loader from 'react-loader';
import DrinkTableRow from './drink-table-row';
import TableHeaders from './table-headers';
import TableButton from './table-button';
import Slider from './slider';
import SearchButton from './search-button';
import {connect} from 'react-redux';
import { getSelectedDrinks, getVisibleDrinks } from '../../shared/selectors';
import { fetchDrinks, maxDistanceChange,checkedChange,showNonStockedChange,sortDrinks} from '../actions';
import { selectDrinkFromSelected } from '../../shared/actions';
import { withRouter } from 'react-router';
import Infinite from 'react-infinite';

class Drinks extends React.Component {

  	constructor(props) {
  		super(props);
  	}

    componentWillMount() {
      // force the user to go to intropage if user loaded indexpage directly.
      if (!this.props.requested) {
          this.props.router.push('/intropage');
      } else if(this.props.shouldUpdateDrinks) {
          this.props.dispatch(fetchDrinks(false, 1, false, true));
      }
    }

    componentWillUnmount() {
      if(this.props.drinks.length > 0) {
        const selected = getSelectedDrinks(this.props.drinks)[0];
        this.props.dispatch(selectDrinkFromSelected(selected));
      }
    }

    elementInfiniteLoad() {
          let text;
          if (getVisibleDrinks(this.props.drinks).length > 0 && !this.props.stopLoadingDrinks) {
            text = "Loading...";
          }
          return (
            <div className="div-table-row">
              <div className="loadingtext centered bolded">
                    {text}
              </div>
            </div>
          )
    }

    handleInfiniteLoad() {
      // if there are no visible drinks, it should not load anything, because if it does, that will result in a never-ending loop.
      // cursor will always be at the end of the table --> it would load more drinks.
      // stopLoadingDrinks is true when the last request returned zero drinks.
      if (getVisibleDrinks(this.props.drinks).length > 0 && !this.props.stopLoadingDrinks) {
        this.props.dispatch(fetchDrinks(false, this.props.pagesLoaded + 1, true, false));
      }
    }

    executeSortDrinks(field,newSortOrder,datatype) {
      this.props.dispatch(sortDrinks(field,newSortOrder,datatype,this.props.stopLoadingDrinks));
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
      return(
          <div>

              <div className="row">
                <div className="col-md-12">
                  <Slider min="0" max="10000" step="100" initialMaxDistance={this.props.initialMaxDistance} onChange={this.props.onSliderChange.bind(this)} />
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <Loader loaded={!this.props.loading} className="loader">
                    <div className="row margin-bottom">
                      <div className="col-md-3 col-xs-9">
                        <TableButton toggleNonStocked={this.props.toggleNonStocked.bind(this)} />
                      </div>
                      <div className="col-md-6 col-xs-9">
                        <SearchButton noOfSelectedDrinks = {noOfSelectedDrinks} noOfVisibleDrinks={visibleDrinks.length} noOfStoresWithSelectedDrinks={numberOfStoresWithSelectedDrinks} />
                      </div>
                    </div>

                        <div className= "div-table table">
                          <Infinite elementHeight={80}
                                    infiniteLoadBeginEdgeOffset={-200}
                                    onInfiniteLoad={this.handleInfiniteLoad.bind(this)}
                                    loadingSpinnerDelegate={this.elementInfiniteLoad()}
                                    isInfiniteLoading={this.props.isInfiniteLoading}
                                    className="div-table-rows"
                                    useWindowAsScrollContainer
                                    preloadBatchSize={Infinite.containerHeightScaleFactor(100)}
                                    preloadAdditionalHeight={Infinite.containerHeightScaleFactor(100)}>
                            <TableHeaders sort={this.executeSortDrinks.bind(this)} headers={this.props.headers} />
                            { visibleDrinks.map((drinkData) => {
                                return (
                                  <DrinkTableRow key={ drinkData.drink._id.$oid }
                                  drinkData={ drinkData } handleChecked = {this.props.handleChecked.bind(this)} />
                                )
                            })}
                            </Infinite>
                        </div>
                  </Loader>
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
    sortDrinks: (field,newSortOrder,datatype,stopLoadingDrinks) => (
      dispatch(sortDrinks(field,newSortOrder,datatype, stopLoadingDrinks))
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
    headers: state.drinksData.tableHeaders
  }
)

const DrinksDisplay = connect(
  mapStateToDrinksProps,
  mapDispatchToDrinksProps
)(DrinksWithRouter);

export default DrinksDisplay;
