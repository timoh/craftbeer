import fetch from 'isomorphic-fetch';

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

export function receiveAddress(address) {
  return {
    type: 'RECEIVE_ADDRESS',
    address: address
  };
}

export function locationToAddress(test) {
  return function (dispatch,getState) {
    const apiCallAddress = (test ? 'http://localhost:3000' : '') + '/geocode/backward';
    const position = getState().positionData.position;
    const body = JSON.stringify({
      latitude: position[0],
      longitude: position[1]
    });
    return fetch(apiCallAddress,{
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: body
      }).then(response => response.text()
      ).then(body => dispatch(receiveAddress(body))
    ).catch(err => console.error(err));
  };
}

export function getLocation() {
  return function (dispatch) {
    dispatch(requestLocation());
    function onPositionResponse(position) {
      dispatch(receiveLocation(position));
      dispatch(locationToAddress(false));
    }
    return getPosition(onPositionResponse);
  };
}
