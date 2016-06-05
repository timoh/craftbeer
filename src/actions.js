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

export function receiveLocation(position) {
  return {
    type: 'RECEIVE_LOCATION',
    position: [position.coords.latitude,position.coords.longitude]
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
    function onPositionResponse(position) {
      dispatch(receiveLocation(position));
    }
    return getPosition(onPositionResponse);
  };
}

export function fetchDrinks() {
  return function (dispatch,getState) {
    dispatch(requestDrinks());
    const positionData = getState().positionData;
    const apiCallAddress = '/home/distanced?lat=' + positionData[0] + '&lng=' + positionData[1];
    return fetch(apiCallAddress)
      .then(response => response.json())
      .then(json =>
        dispatch(receiveDrinks(json))
      );
  };
}
