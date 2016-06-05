import { combineReducers } from 'redux';

function drinksReducer(state = {
  isFetching: false,
  drinks: []
}, action) {
  switch (action.type) {
    case 'REQUEST_DRINKS':
      return Object.assign({}, state, {
        isFetching: true
      });
    case 'RECEIVE_DRINKS':
      return Object.assign({}, state, {
        isFetching: false,
        drinks: action.drinks
      });
    default:
      return state;
  }
}

// all the logic in drinks container regarding state handling should be implemented here.
// also, if location and drinks are fetched at once, should consider this in the implementation of reducers.
// affects e.g. loading / loaded boolean value.

function locationReducer(state = {
  position: [0.00, 0.00]
}, action) {
  switch (action.type) {
    case 'RECEIVE_LOCATION':
      return Object.assign({}, state, {
        position: action.position
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
