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
    position: position
  };
}

function getPosition(callback) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(callback);
    } else {
        return;
    }
}

export function getLocationAndDrinks() {
  return function (dispatch) {
    function onPositionResponse(position) {
      dispatch(receiveLocation(position));
      dispatch(fetchDrinks(position));
    }
    return getPosition(onPositionResponse);
  };
}

export function fetchDrinks(position) {
  return function (dispatch) {
    dispatch(requestDrinks());
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const apiCallAddress = '/home/distanced?lat=' + latitude + '&lng=' + longitude;
    return fetch(apiCallAddress)
      .then(response => response.json())
      .then(json =>
        dispatch(receiveDrinks(json))
      );
  };
}
