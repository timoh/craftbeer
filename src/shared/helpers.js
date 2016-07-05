import update from 'react-addons-update';

export function updateMatchesDistanceCondition(availsData,givenMaxDistance) {
    let updatedAvailsData;
    const storesMatchingDistanceCondition = [];
    const nearbyStoresWithAvailability = [];
    if(availsData !== undefined) {
      availsData.map(function(availData,index){
        const matchesDistanceCondition = availData.distance_in_m <= givenMaxDistance;
        const updatedAvailData = update(availData, {$merge: {matchesDistanceCondition: matchesDistanceCondition}});
        if(matchesDistanceCondition) {
            storesMatchingDistanceCondition.push(updatedAvailData);
            if(updatedAvailData.avail.amount > 0) {
              nearbyStoresWithAvailability.push(updatedAvailData);
            }
        }
        updatedAvailsData = handleArrayUpdate(index,availData,updatedAvailData,availsData,updatedAvailsData);
      });
    }
    return [updatedAvailsData, storesMatchingDistanceCondition, nearbyStoresWithAvailability];
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
  } else if (type=="boolean") {
    return sortBy(field,sortOrder,(a) => a ? 1 : 0);
  } else {
    let isDrinkField;
    if (field =="reviewTitle") {
      isDrinkField = false;
    } else {
      isDrinkField = true;
    }
    return sortBy(field,sortOrder, (a) => a.toUpperCase(), isDrinkField);
  }
}

export function sortBy(field,reverse,primer,isDrinkField){
  let key;
  if(primer) {
    key = function(x) {
      return isDrinkField ? primer(x.drink[field]) : primer(x[field]);
    };
  } else {
    key = function(x) {
      return isDrinkField ? x.drink[field] : x[field];
    };
  }
   reverse = !reverse ? 1 : -1;
   return function (a, b) {
     return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
   };
}

String.prototype.capitalize = function() {
    return this.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
};
