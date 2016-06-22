import { combineReducers } from 'redux';

import * as drinks from '../drinks';
import * as location from '../location';

export default combineReducers({
  drinksData: drinks.reducer,
  positionData: location.reducer,
});
