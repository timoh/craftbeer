import { combineReducers } from 'redux';
import update from 'react-addons-update';
import * as Helpers from '../redux/helpers';

function drinksReducer(state = {
  loading: false,
  drinks: [],
  initialMaxDistance: 2000,
  storesWithSelectedDrinks: {}
}, action) {
  switch (action.type) {
    case 'REQUEST_DRINKS':
      return Object.assign({}, state, {
        loading: true
      });
    case 'RECEIVE_DRINKS':
      return Object.assign({}, state, {
        drinks: action.drinks
      });
    case 'ADD_ADDITIONAL_DATA':
      return Object.assign({}, state, {
        loading: false,
        drinks: additionalDrinksDataReducer(state.drinks,state.initialMaxDistance)
      });
    case 'MAX_DISTANCE_CHANGE':
      const drinksAfterDistChange = maxDistanceChangeReducer(state.drinks,action.newMaxDistance);
      return Object.assign({}, state, {
        drinks: drinksAfterDistChange,
        storesWithSelectedDrinks: storesReducer(state.storesWithSelectedDrinks,drinksAfterDistChange)
      });
    case 'SORT':
      return Object.assign({}, state, {
       drinks: sortReducer(state.drinks,action.field,action.newSortOrder,action.datatype)
      });
    case 'CHECKED_CHANGE':
      const drinksAfterCheckedChange = checkedReducer(state.drinks,action.source);
      return Object.assign({}, state, {
        drinks: drinksAfterCheckedChange,
        storesWithSelectedDrinks: storesReducer(state.storesWithSelectedDrinks,drinksAfterCheckedChange)
      });
    case 'TOGGLE_NON_STOCKED':
      return Object.assign({}, state, {
        drinks: toggleNonStockedReducer(state.drinks,action.showNonStocked)
      });
    case 'SELECT_ALL':
      return Object.assign({}, state, {
        drinks: changedSelectedForAllReducer(state.drinks,true)
      });
    case 'DESELECT_ALL':
        return Object.assign({}, state, {
          drinks: changedSelectedForAllReducer(state.drinks,false)
    });
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
    if(showNonStocked && !drink.visible) {
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

function checkedReducer(state,sourceComponent) {
  const index = state.indexOf(sourceComponent.props.drinkData);
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
      const storesData = Helpers.updateMatchesDistanceCondition(drinkData.avails,maxDistance);
      const maxAvailability = Helpers.calculateMaxAvailability(drinkData.avails);
      const stocked = Helpers.isStocked(maxAvailability);
      const updatedDrink = update(drinkData, {$merge: {
          score: score,
          reviewTitle: reviewTitle,
          maxAvailability: maxAvailability,
          stocked: stocked,
          visible: true,
          noOfStoresMatchingDistanceCondition: storesData[0].length,
          noOfNearbyStoresWithAvailability: storesData[1].length,
          nearbyStoresWithAvailability: storesData[1],
          selected: false
        }});
      updatedDrinks = Helpers.handleArrayUpdate(arrayIndex,drinkData,updatedDrink,state,updatedDrinks);
    }.bind(this));
      return updatedDrinks;
}

function maxDistanceChangeReducer(state,newMaxDistance){
  let updatedDrinks;
  state.map(function(drinkData,arrayIndex) {
    const storesData = Helpers.updateMatchesDistanceCondition(drinkData.avails,newMaxDistance);
    const maxAvailability = Helpers.calculateMaxAvailability(drinkData.avails);
    const stocked = Helpers.isStocked(maxAvailability);
    const updatedDrink = update(drinkData, {$merge: {
        maxAvailability: maxAvailability,
        stocked: stocked,
        noOfStoresMatchingDistanceCondition: storesData[0].length,
        noOfNearbyStoresWithAvailability: storesData[1].length,
        nearbyStoresWithAvailability: storesData[1]
      }});
    updatedDrinks = Helpers.handleArrayUpdate(arrayIndex,drinkData,updatedDrink,state,updatedDrinks);
  }.bind(this));
  return updatedDrinks;
}

function storesReducer(stores,drinks) {
  const storesMatchingConditions = {};
  const selectedDrinks = Helpers.getSelectedDrinks(drinks);
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

function locationReducer(state = {
  position: [0.00, 0.00],
  loading: false,
  requested: false
}, action) {
  switch (action.type) {
    case 'REQUEST_LOCATION': {
      return Object.assign({}, state, {
        loading: true,
        requested: true
      });
    }
    case 'RECEIVE_LOCATION':
      return Object.assign({}, state, {
        position: action.position,
        loading: false
    });

    default:
      return state;
  }
}

const rootReducer = combineReducers({
  drinksData: drinksReducer,
  positionData: locationReducer
});

export default rootReducer;
