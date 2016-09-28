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

export function runSortDrinks(field,newSortOrder,datatype,stopLoadingDrinks,filterOn) {

  if (SORTABLE_FIELDS_IN_API.indexOf(field) != -1 && !stopLoadingDrinks && !filterOn) {
    const sortOrder = newSortOrder ? "desc" : "asc";
    return function(dispatch) {
      dispatch(changeSort(field,newSortOrder,datatype));
      dispatch(fetchDrinks(1, false, false, field, sortOrder));
    };
  } else {
    return function(dispatch) {
      dispatch(sortDrinks(field,newSortOrder,datatype));
    };
  }
}

export function sortDrinks(field,newSortOrder,datatype) {
  return {
    type: 'SORT',
    field: field,
    newSortOrder: newSortOrder,
    datatype: datatype
  };
}

export function changeSort(field,newSortOrder,datatype) {
  return {
    type: 'CHANGE_SORT',
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

export function requestDrinks(pageToLoad, isInfiniteLoad, isInitialLoad) {

  return {
    type: 'REQUEST_DRINKS',
    pageLoading: pageToLoad,
    isInfiniteLoad: isInfiniteLoad,
    isInitialLoad: isInitialLoad
  };
}

export function receiveDrinks(json, filtered) {
  return {
    type: 'RECEIVE_DRINKS',
    drinks: json,
    filtered: filtered
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

export function changeFilter(filterText) {
  return {
    type: 'CHANGE_FILTER',
    filterText: filterText
  };
}

export function clearFilter() {
  return {
    type: 'CLEAR_FILTER'
  };
}

export function searchForDrinks() {
  return function(dispatch, getState) {
    const filterText = getState().drinksData.filterText;
    const sortColumn = getState().drinksData.apiSortColumn;
    const sortOrder = getState().drinksData.apiSortOrder;
    dispatch(fetchDrinks(1, false, false, sortColumn, sortOrder, filterText));
  };
}

export function fetchDrinks(pageToLoad, isInfiniteLoad, isInitialLoad, sortColumn, sortOrder, filterText) {
  return function (dispatch,getState) {
    dispatch(requestDrinks(pageToLoad, isInfiniteLoad, isInitialLoad));
    const positionData = getState().positionData;
    let apiCallAddress = '/home/distanced?';
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
      // TODO it can't use such field names that API doesn't support!
      params.sort_column = getState().drinksData.apiSortColumn;
      params.sort_order = getState().drinksData.apiSortOrder;
    }
    let filtered = false;
    if (filterText !== undefined && filterText !== '') {
      params.filter = filterText;
      filtered = true;
    }
    apiCallAddress = apiCallAddress + jQuery.param( params );
    const request = new Request(apiCallAddress, {
      method: 'GET'
    });
    return fetch(request)
      .then(response => response.json())
      .then((json) =>
        dispatch(receiveDrinks(json, filtered))
      ).then(() => dispatch(addAdditionalDataForDrinks()))
      .then(() =>
        dispatch(sortDrinks(
                  getState().drinksData.sortColumn,
                  getState().drinksData.sortOrder == "desc" ? true : false,
                  getState().drinksData.sortDataType
                ))
      ).then(() => {
          if(isInitialLoad) {
            dispatch(showNonStockedChange(false));
          }
      }).then(() => dispatch(drinksUpdated()))
      .catch(err => console.error(err));
  };
}
