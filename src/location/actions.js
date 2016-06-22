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

export function getPosition(callback) {
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
