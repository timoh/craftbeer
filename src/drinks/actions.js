import fetch from 'isomorphic-fetch';
import { drinksUpdated } from '../shared/actions';
import { SORTABLE_FIELDS_IN_API } from './constants';

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

export function sortDrinks(field,newSortOrder,datatype,stopLoadingDrinks) {

  if (SORTABLE_FIELDS_IN_API.indexOf(field) != -1 && !stopLoadingDrinks) {
    const sortOrder = newSortOrder ? "desc" : "asc";
    return function(dispatch) {
      dispatch(changeSort(field,newSortOrder));
      dispatch(fetchDrinks(false, 1, false, false, field, sortOrder));
    };
  } else {
    return {
      type: 'SORT',
      field: field,
      newSortOrder: newSortOrder,
      datatype: datatype
    };
  }
}

export function changeSort(field,newSortOrder) {
  return {
    type: 'CHANGE_SORT',
    field: field,
    newSortOrder: newSortOrder
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

export function requestDrinks(pageToLoad, isInfiniteLoad, isInitialLoad) {

  return {
    type: 'REQUEST_DRINKS',
    pageLoading: pageToLoad,
    isInfiniteLoad: isInfiniteLoad,
    isInitialLoad: isInitialLoad
  };
}

export function receiveDrinks(json) {
  return {
    type: 'RECEIVE_DRINKS',
    drinks: json
  };
}

export function addAdditionalDataForDrinks() {
  return {
    type: 'ADD_ADDITIONAL_DATA'
  };
}

export function showNonStockedChange(showNonStocked) {
  return {
    type: 'TOGGLE_NON_STOCKED',
    showNonStocked: showNonStocked
  };
}


export function fetchDrinks(test, pageToLoad, isInfiniteLoad, isInitialLoad, sortColumn, sortOrder) {
  return function (dispatch,getState) {
    dispatch(requestDrinks(pageToLoad, isInfiniteLoad, isInitialLoad));
    const positionData = getState().positionData;
    // this is a stupid solution to the problem that in testing you can't use relative urls, but couldn't bother to think of a better one...
    let apiCallAddress = (test ? 'http://localhost:3000' : '') + '/home/distanced?';
    const params = {
      lat: positionData.position[0],
      lng: positionData.position[1],
      page: pageToLoad
    };
    if(sortColumn !== undefined && sortOrder !== undefined) {
      params.sort_column = sortColumn;
      params.sort_order = sortOrder;
    } else {
      // previous sort order should be kept. it is set to "title", "asc" by default.
      params.sort_column = getState().drinksData.sortColumn;
      params.sort_order = getState().drinksData.sortOrder;
    }
    apiCallAddress = apiCallAddress + jQuery.param( params );
    const request = new Request(apiCallAddress, {
      method: 'GET'
    });
    return fetch(request)
      .then(response => response.json())
      .then((json) =>
        dispatch(receiveDrinks(json))
      ).then(() => dispatch(addAdditionalDataForDrinks()))
      .then(() => {
          if(isInitialLoad) {
            dispatch(showNonStockedChange(false));
          }
      }).then(() => dispatch(drinksUpdated()))
      .catch(err => console.error(err));
  };
}
