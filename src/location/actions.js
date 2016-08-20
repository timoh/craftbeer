import fetch from 'isomorphic-fetch';
import { hashHistory } from 'react-router';

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

export function receivePopularLocations(popularLocations) {
  return {
    type: 'RECEIVE_POPULAR_LOCATIONS',
    popularLocations: popularLocations
  };
}

export function locationToAddress() {
  return function (dispatch,getState) {
    const apiCallAddress = '/geocode/backward';
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

export function getPopularLocations() {
  return function (dispatch) {
    const apiCallAddress = '/popular_locations.json';
    return fetch(apiCallAddress).then(response => response.json()
  ).then(body => dispatch(receivePopularLocations(body))
    ).catch(err => console.error(err));
  };
}

export function getLocation() {
  return function (dispatch) {
    dispatch(requestLocation());
    function onPositionResponse(position) {
      dispatch(receiveLocation(position.coords.latitude,position.coords.longitude,true));
      dispatch(locationToAddress());
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

export function searchForPopularLocation(address) {
  return function(dispatch) {
    dispatch(inputAddress(address));
    dispatch(geocodeAddress()).then(() => hashHistory.push('/indexpage'));
  };
}
