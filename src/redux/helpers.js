import update from 'react-addons-update';

export function updateMatchesDistanceCondition(availsData,givenMaxDistance) {
    const storesMatchingDistanceCondition = [];
    const nearbyStoresWithAvailability = [];
    if(availsData !== undefined) {
      availsData.map(function(availData){
        availData.matchesDistanceCondition = availData.distance_in_m <= givenMaxDistance;
        if(availData.matchesDistanceCondition) {
            storesMatchingDistanceCondition.push(availData);
            if(availData.avail.amount > 0) {
              nearbyStoresWithAvailability.push(availData);
            }
        }
      });
    }
    return [storesMatchingDistanceCondition,nearbyStoresWithAvailability];
}

export function calculateMaxAvailability(availsData) {
  let maxAvailability = 0;
  if (availsData !== undefined) {
      availsData.map(function(availData){
      if(availData.matchesDistanceCondition && availData.avail.amount > maxAvailability) {
        maxAvailability = availData.avail.amount;
      }
    });
  }
  return maxAvailability;
}

export function handleArrayUpdate(arrayIndex,originalDrink,updatedDrink,originalDrinks,updatedDrinks){
  const index = originalDrinks.indexOf(originalDrink);
  if(index!=-1) {
    let arrayToUpdate;
    if (arrayIndex === 0) {
      arrayToUpdate = originalDrinks;
    } else {
      arrayToUpdate = updatedDrinks;
    }
    return update(arrayToUpdate, { $splice: [[index, 1, updatedDrink]] });
  }
}

export function isStocked(maxAvailability) {
  return maxAvailability > 0;
}


export function handleSort(field,sortOrder,type) {
  if (type=="float") {
    return sortBy(field,sortOrder,parseFloat,true);
  } else if (type=="int") {
    return sortBy(field,sortOrder,parseInt,false);
  } else {
    let isDrinkField;
    if (field =="reviewTitle") {
      isDrinkField = false;
    } else {
      isDrinkField = true;
    }
    return sortBy(field,sortOrder, function(a){return a.toUpperCase();}, isDrinkField);
  }
}

export function sortBy(field,reverse,primer,isDrinkField){
  let key;
  if(primer) {
    if(isDrinkField) {
      key = function(x) {
        return primer(x.drink[field]);
      };
    } else {
      key = function(x) {
        return primer(x[field]);
      };
    }
  } else {
    if(isDrinkField) {
      key = function(x) {
        return x.drink[field];
      };
    } else {
      key = function(x) {
        return x[field];
      };
    }
  }
   reverse = !reverse ? 1 : -1;
   return function (a, b) {
     return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
   };
}

export function getSelectedDrinks(drinks) {
  const selectedDrinks = [];
  drinks.map(function(drinkData) {
    if(drinkData.selected) {
      selectedDrinks.push(drinkData);
    }
  });
  return selectedDrinks;
}
