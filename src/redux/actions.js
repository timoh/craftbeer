import fetch from 'isomorphic-fetch';

export function requestDrinks() {
  return {
    type: 'REQUEST_DRINKS'
  };
}

export function receiveDrinks(json) {
  return {
    type: 'RECEIVE_DRINKS',
    drinks: json
  };
}

export function requestLocation() {
  return {
    type: 'REQUEST_LOCATION'
  };
}

export function receiveLocation(position) {
  return {
    type: 'RECEIVE_LOCATION',
    position: [position.coords.latitude,position.coords.longitude]
  };
}

export function addAdditionalDataForDrinks() {
  return {
    type: 'ADD_ADDITIONAL_DATA'
  };
}

export function maxDistanceChange(newMaxDistance) {
  return {
    type: 'MAX_DISTANCE_CHANGE',
    newMaxDistance: newMaxDistance
  };
}

export function checkedChange(drinkData) {
  return {
    type: 'CHECKED_CHANGE',
    drinkData: drinkData
  };
}

export function showNonStockedChange(showNonStocked) {
  return {
    type: 'TOGGLE_NON_STOCKED',
    showNonStocked: showNonStocked
  };
}

export function sortDrinks(field,newSortOrder,datatype) {
  return {
    type: 'SORT',
    field: field,
    newSortOrder: newSortOrder,
    datatype: datatype
  };
}

export function selectAll() {
  return {
    type: 'SELECT_ALL'
  };
}

export function deSelectAll() {
  return {
    type: 'DESELECT_ALL'
  };
}



function getPosition(callback) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(callback);
    } else {
        return;
    }
}

export function getLocation() {
  return function (dispatch) {
    dispatch(requestLocation());
    function onPositionResponse(position) {
      dispatch(receiveLocation(position));
    }
    return getPosition(onPositionResponse);
  };
}

export function fetchDrinks(test) {
  return function (dispatch,getState) {
    dispatch(requestDrinks());
    const positionData = getState().positionData;
    // this is a stupid solution to the problem that in testing you can't use relative urls, but couldn't bother to think of a better one...
    const apiCallAddress = (test ? 'http://localhost:3000' : '') + '/home/distanced?lat=' + positionData.position[0] + '&lng=' + positionData.position[1];
    return fetch(apiCallAddress)
      .then(response => response.json())
      .then(json =>
        dispatch(receiveDrinks(json))
      ).then(() => dispatch(addAdditionalDataForDrinks()))
      .catch(err => console.error(err));
  };
}
