import fetch from 'isomorphic-fetch';

export function requestLocation() {
  return {
    type: 'REQUEST_LOCATION'
  };
}

export function receiveLocation(lat,lon,loading) {
  return {
    type: 'RECEIVE_LOCATION',
    position: [lat,lon],
    loading: loading
  };
}

export function getPosition(callback) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(callback);
    } else {
        return;
    }
}

export function inputAddress(address) {
  return {
    type: 'INPUT_ADDRESS',
    address: address
  };
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
      dispatch(receiveLocation(position.coords.latitude,position.coords.longitude,true));
      dispatch(locationToAddress(false));
    }
    return getPosition(onPositionResponse);
  };
}

export function geocodeAddress() {
  return function (dispatch,getState){
    dispatch(requestLocation());
    const address = getState().positionData.address;
    const request = new Request('/geocode/forward', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        address: address
      })
    });
    return fetch(request)
      .then(response => response.json())
      .then(json => dispatch(receiveLocation(json.lat, json.lng,false)))
      .catch(err => console.error(err));
  };
}
