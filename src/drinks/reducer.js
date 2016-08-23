import update from 'react-addons-update';
import * as Helpers from '../shared/helpers';
import { getSelectedDrinks, getVisibleDrinks } from '../shared/selectors';


function getInitialState() {
  return {
    loading: false,
    drinks: [],
    initialMaxDistance: 2000,
    storesWithSelectedDrinks: {},
    drinkWithProductInfoShown: {},
    showNonStocked: false,
    isInfiniteLoading: false,
    pagesLoaded: 0,
    pageLoading: 0,
    stopLoadingDrinks: false,
    isInitialLoad: false,
    sortColumn: "title",
    sortOrder: "asc",
    tableHeaders: Helpers.getHeaders(),
    filterText: "",
    filterOn: false
  };
}

export function reducer(state = getInitialState(), action) {
  switch (action.type) {
    case 'REQUEST_DRINKS':
      return {
        ...state,
        loading: !action.isInfiniteLoad,
        isInfiniteLoading: action.isInfiniteLoad,
        isInitialLoad: action.isInitialLoad,
        pageLoading: action.pageLoading
      };
    case 'RECEIVE_DRINKS':
      return {
        ...state,
        drinks: drinksReducer(state.drinks, action.drinks, state.isInitialLoad, state.pageLoading, state.showNonStocked),
        pagesLoaded: state.pageLoading,
        pageLoading: 0,
        isInitialLoad: false,
        stopLoadingDrinks: !action.filtered && action.drinks.length === 0,
        filterOn: action.filtered
      };
    case 'ADD_ADDITIONAL_DATA':
      return {
        ...state,
        loading: false,
        isInfiniteLoading: false,
        drinks: additionalDrinksDataReducer(state.drinks,state.initialMaxDistance, state.showNonStocked)
      };
    case 'MAX_DISTANCE_CHANGE':
      const drinksAfterDistChange = maxDistanceChangeReducer(state.drinks,action.newMaxDistance);
      const drinksAfterVisibilityChange = toggleNonStockedReducer(drinksAfterDistChange,state.showNonStocked);
      return {
        ...state,
        drinks: drinksAfterVisibilityChange,
        storesWithSelectedDrinks: storesReducer(drinksAfterVisibilityChange),
        initialMaxDistance: action.newMaxDistance
      };
    case 'SORT':
      return {
        ...state,
        sortColumn: action.field == "selected" ? state.sortColumn : action.field,
        sortOrder: action.field == "selected" ? state.sortOrder : (action.newSortOrder ? "desc" : "asc"),
        drinks: sortReducer(state.drinks,action.field,action.newSortOrder,action.datatype),
        tableHeaders: headersReducer(state.tableHeaders,action.field,action.newSortOrder)
      };
    case 'CHANGE_SORT':
        return {
          ...state,
          sortColumn: action.field == "selected" ? state.sortColumn : action.field,
          sortOrder: action.field == "selected" ? state.sortOrder : (action.newSortOrder ? "desc" : "asc"),
          tableHeaders: headersReducer(state.tableHeaders,action.field,action.newSortOrder)
        };
    case 'CHECKED_CHANGE':
      const drinksAfterCheckedChange = checkedReducer(state.drinks,action.drinkData);
      return {
        ...state,
        drinks: drinksAfterCheckedChange,
        storesWithSelectedDrinks: storesReducer(drinksAfterCheckedChange)
      };
    case 'TOGGLE_NON_STOCKED':
      const drinksAfterToggle = toggleNonStockedReducer(state.drinks,action.showNonStocked);
      return {
        ...state,
        drinks: drinksAfterToggle,
        storesWithSelectedDrinks: storesReducer(drinksAfterToggle),
        showNonStocked: action.showNonStocked
      };
    case 'SELECT_ALL':
      const drinksAfterSelectAll = changedSelectedForAllReducer(state.drinks,true);
      return {
        ...state,
        drinks: drinksAfterSelectAll,
        storesWithSelectedDrinks: storesReducer(drinksAfterSelectAll)
      };
    case 'DESELECT_ALL':
      const drinksAfterDeSelectAll = changedSelectedForAllReducer(state.drinks,false);
      return {
        ...state,
        drinks: drinksAfterDeSelectAll,
        storesWithSelectedDrinks: storesReducer(drinksAfterDeSelectAll)
      };
    case 'SELECT_DRINK_FROM_SELECTED':
      return {
        ...state,
        drinkWithProductInfoShown: action.selectedDrink
      }
    case 'CHANGE_FILTER':
      return {
        ...state,
        filterText: action.filterText
      }
    default:
      return state;
  }
}

function drinksReducer(state, newDrinks, initialLoad, page, showNonStocked) {
  if (initialLoad) {
    newDrinks.map( (newDrink) => newDrink.isNewDrink = true);
    return newDrinks;
  } else {
    let updatedDrinks;
    state.map(function(drink,arrayIndex) {
      // initialize isNewDrink to false
      const drinkToUpdate = update(drink, {$merge: { isNewDrink: false, drinkInNewDrinks: false }});
      updatedDrinks = Helpers.handleArrayUpdate(arrayIndex,drink,drinkToUpdate,state,updatedDrinks);
    });
    let newState;
    if (page > 1) {
      newState = getVisibleDrinks(updatedDrinks);
    } else {
      newState = [];
    }
    newDrinks.map( (newDrink) => {
      const index = Helpers.getDrinkIndex(updatedDrinks, newDrink);
      if(index != -1) {
        const existingDrink = updatedDrinks[index];
        existingDrink.drinkInNewDrinks = true;
        // when page > 1, then there might be drinks that were previously hidden.
        existingDrink.visible = Helpers.isVisible(showNonStocked,existingDrink.stocked);
        existingDrink.hiddenDueToSortingChange = false;
        newState.push(existingDrink);
      } else {
        newDrink.isNewDrink = true;
        newState.push(newDrink);
      }
    })

    const drinksNotInNewDrinks = updatedDrinks.filter(d => !d.drinkInNewDrinks);

    drinksNotInNewDrinks.map( (drink) => {
      const drinkWasVisible = drink.visible;
      if (page == 1) {
        drink.visible = false;
        drink.hiddenDueToSortingChange = true;
      }

      if (page == 1 || (page > 1 && !drinkWasVisible)) {
        newState.push(drink);
      }
    });
    return newState;
  }
  /*
  1. initial load --> new state = newDrinks
  2. infinite load due to scrolling --> new state = visible state + newDrinks + hidden state
    2.1 if sorting has changed, then there needs to be a check regarding whether the newDrinks are already in state. If they are, then simply make them visible considering the sorting order.
  3. initial load after the location has changed -> new state = newDrinks (clear previous state)
  4. sorting:
    4.1 compare newDrinks to state and keep only unique drinks. put newDrinks first so that sorting order is maintained.
    4.2 hide the drinks that were previously in state and are not in newDrinks.
    Otherwise the user has to scroll down the page to get the correct drinks for page 2 while keeping the selected sorting order.
  */
}

function changedSelectedForAllReducer(state,newValue) {
  let updatedDrinks;
  state.map(function(drink,arrayIndex) {
    const updatedDrink = update(drink, {$merge: {selected:newValue}});
    updatedDrinks = Helpers.handleArrayUpdate(arrayIndex,drink,updatedDrink,state,updatedDrinks);
  });
  return updatedDrinks;
}

function toggleNonStockedReducer(state,showNonStocked) {
  let updatedDrinks;
  state.map(function(drink,arrayIndex) {

    const visible = drink.hiddenDueToSortingChange ? false : Helpers.isVisible(showNonStocked,drink.stocked);
    const selected = !visible ? false : drink.selected;

    const updatedDrink = update(drink, {$merge: {visible:visible, selected: selected}});
    updatedDrinks = Helpers.handleArrayUpdate(arrayIndex,drink,updatedDrink,state,updatedDrinks);
  });
  return updatedDrinks;
}

function checkedReducer(state,drinkData) {
  const index = state.indexOf(drinkData);
  const drinkInState = state[index];
  const updatedDrink = update(drinkInState,{$merge: {selected:!drinkInState.selected}});
  const updatedDrinks = update(state, { $splice: [[index,1,updatedDrink]] });
  return updatedDrinks;
}

function additionalDrinksDataReducer(state,maxDistance,showNonStocked) {
    let updatedDrinks;
    let counter = 0;
    state.map(function(drinkData,arrayIndex) {
      if(drinkData.isNewDrink) {
        counter++;
        let review_score;
        let review_title;
        if(drinkData.reviews!==undefined && drinkData.reviews!==null) {
          review_score=drinkData.reviews.score;
          review_title= drinkData.reviews.title;
        } else {
          review_score ='';
          review_title = '';
        }
        const availsAndStoresData = Helpers.updateMatchesDistanceCondition(drinkData.avails,maxDistance);
        const maxAvailability = Helpers.calculateMaxAvailability(availsAndStoresData[0]);
        const stocked = Helpers.isStocked(maxAvailability);
        const updatedDrink = update(drinkData, {$merge: {
            avails: availsAndStoresData[0],
            review_score: review_score,
            review_title: review_title,
            maxAvailability: maxAvailability,
            stocked: stocked,
            visible: Helpers.isVisible(showNonStocked,stocked),
            noOfStoresMatchingDistanceCondition: availsAndStoresData[1].length,
            noOfNearbyStoresWithAvailability: availsAndStoresData[2].length,
            nearbyStoresWithAvailability: availsAndStoresData[2],
            selected: false
          }});
        updatedDrinks = Helpers.handleArrayUpdate(arrayIndex,drinkData,updatedDrink,state,updatedDrinks);
      }
    }.bind(this));
    return counter == 0 ? state : updatedDrinks;
}

function maxDistanceChangeReducer(state,newMaxDistance){
  let updatedDrinks;
  state.map(function(drinkData,arrayIndex) {
    const availsAndStoresData = Helpers.updateMatchesDistanceCondition(drinkData.avails,newMaxDistance);
    const maxAvailability = Helpers.calculateMaxAvailability(availsAndStoresData[0]);
    const stocked = Helpers.isStocked(maxAvailability);
    const updatedDrink = update(drinkData, {$merge: {
        avails: availsAndStoresData[0],
        maxAvailability: maxAvailability,
        stocked: stocked,
        noOfStoresMatchingDistanceCondition: availsAndStoresData[1].length,
        noOfNearbyStoresWithAvailability: availsAndStoresData[2].length,
        nearbyStoresWithAvailability: availsAndStoresData[2]
      }});
    updatedDrinks = Helpers.handleArrayUpdate(arrayIndex,drinkData,updatedDrink,state,updatedDrinks);
  }.bind(this));
  return updatedDrinks;
}

function storesReducer(drinks) {
  const storesMatchingConditions = {};
  const selectedDrinks = getSelectedDrinks(drinks);
  selectedDrinks.map(function(drinkData,index) {
    if(drinkData.nearbyStoresWithAvailability !== undefined) {
      //if the 1st drink, add all stores.
      if(index === 0) {
          drinkData.nearbyStoresWithAvailability.map(function(storeInArray) {
            storesMatchingConditions[storeInArray.store._id.$oid] = storeInArray;
          });
      } else {
          // loop the already added stores and check if they are present in the stores with availability for other drinks. If not, remove them.
          // principle: the resulting number of stores cannot increase once the stores for 1st drink have been added.
          const keysToRemove = [];
          const keysForStoresWithAvailability = [];
          drinkData.nearbyStoresWithAvailability.map(function(storeInArray) {
            keysForStoresWithAvailability.push(storeInArray.store._id.$oid);
          });
          Object.keys(storesMatchingConditions).map(function(key) {
              if(keysForStoresWithAvailability.indexOf(key) ==-1) {
                keysToRemove.push(key);
              }
          });
          keysToRemove.map(function(keyToRemove){
              delete storesMatchingConditions[keyToRemove];
          });
        }
      }
    });

    return storesMatchingConditions;
}

function sortReducer(state,field,newSortOrder,type){
    return state.slice().sort(Helpers.handleSort(field,newSortOrder,type));
}

function headersReducer(state,field,newSortOrder) {
  const index = state.map(h => h.field).indexOf(field);
  const headerInState = state[index];
  const updatedHeader = update(headerInState,{$merge: {sortOrder:newSortOrder}});
  const updatedHeaders = update(state, { $splice: [[index,1,updatedHeader]] });
  return updatedHeaders;
}
