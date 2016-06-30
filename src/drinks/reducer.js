import update from 'react-addons-update';
import * as Helpers from '../shared/helpers';
import { getSelectedDrinks } from '../shared/selectors';

export function reducer(state = {
  loading: false,
  drinks: [],
  initialMaxDistance: 2000,
  storesWithSelectedDrinks: {},
  drinkWithProductInfoShown: {},
  showNonStocked: false
}, action) {
  switch (action.type) {
    case 'REQUEST_DRINKS':
      return {
        ...state,
        loading: true
      };
    case 'RECEIVE_DRINKS':
      return {
        ...state,
        drinks: action.drinks
      };
    case 'ADD_ADDITIONAL_DATA':
      return {
        ...state,
        loading: false,
        drinks: additionalDrinksDataReducer(state.drinks,state.initialMaxDistance)
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
        drinks: sortReducer(state.drinks,action.field,action.newSortOrder,action.datatype)
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
    default:
      return state;
  }
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
    let visible;
    if(showNonStocked) {
      visible = true;
    } else {
      visible = drink.stocked ? true : false;
    }
    let selected;
    if (!visible) {
      selected = false;
    } else {
      selected = drink.selected;
    }
    const updatedDrink = update(drink, {$merge: {visible:visible, selected: selected}});
    updatedDrinks = Helpers.handleArrayUpdate(arrayIndex,drink,updatedDrink,state,updatedDrinks);
  });
  return updatedDrinks;
}

function checkedReducer(state,drinkData) {
  const index = state.indexOf(drinkData);
  const drinkInState = state[index];
  const currentSelected = drinkInState.selected;
  const updatedDrink = update(drinkInState,{$merge: {selected:!currentSelected}});
  const updatedDrinks = update(state, { $splice: [[index,1,updatedDrink]] });
  return updatedDrinks;
}

function additionalDrinksDataReducer(state,maxDistance) {
    let updatedDrinks;
    state.map(function(drinkData,arrayIndex) {
      let score;
      let reviewTitle;
      if(drinkData.reviews!==undefined && drinkData.reviews!==null) {
        score=drinkData.reviews.score;
        reviewTitle= drinkData.reviews.title;
      } else {
        score ='';
        reviewTitle = '';
      }
      const availsAndStoresData = Helpers.updateMatchesDistanceCondition(drinkData.avails,maxDistance);
      const maxAvailability = Helpers.calculateMaxAvailability(availsAndStoresData[0]);
      const stocked = Helpers.isStocked(maxAvailability);
      const updatedDrink = update(drinkData, {$merge: {
          avails: availsAndStoresData[0],
          score: score,
          reviewTitle: reviewTitle,
          maxAvailability: maxAvailability,
          stocked: stocked,
          visible: true,
          noOfStoresMatchingDistanceCondition: availsAndStoresData[1].length,
          noOfNearbyStoresWithAvailability: availsAndStoresData[2].length,
          nearbyStoresWithAvailability: availsAndStoresData[2],
          selected: false
        }});
      updatedDrinks = Helpers.handleArrayUpdate(arrayIndex,drinkData,updatedDrink,state,updatedDrinks);
    }.bind(this));
      return updatedDrinks;
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
