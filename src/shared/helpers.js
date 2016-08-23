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
    if (arrayIndex === 0 || updatedDrinks === undefined) {
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
    return sortBy(field,sortOrder,(a) => a ? 1 : 0,false);
  } else {
    return sortBy(field,sortOrder, (a) => a.toUpperCase(), true);
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

export function getDrinkIndex(state, newDrink) {
  const objectIds = state.map( (drinkInState) => drinkInState.drink._id.$oid );
  return objectIds.indexOf(newDrink.drink._id.$oid);
}

export function isVisible(showNonStocked,stocked) {
  return showNonStocked ? true : stocked;
}

String.prototype.capitalize = function() {
    return this.replace(/(?:^|\s)\S/g, (a) => a.toUpperCase());
};

export function normalScreenWidth() {
  return window.matchMedia("(min-width: 600px)").matches;
}

export function getHeaders() {
  // sortOrder = false on nouseva järjestys, sortOrder = true on laskeva järjestys. vaikuttaa sort-metodin reverse -parametriin.
  // alkuarvo on käänteinen siksi, että kun linkkiä klikkaa 1. kertaa, niin haluttu järjestys on oikea. Järjestys muuttuu jo ensi klikkauksella.
  return  [
    {
      key: "selected",
      name: "Show selected on top",
      field: "selected",
      sortOrder: false,
      type: "boolean",
      className:"div-table-col",
      secondLink: true,
      thirdLink: true
    },
    {
      key: "drink_title",
      name: "Drink title",
      field: "title",
      sortOrder: true,
      type: "string",
      className:"div-table-col",
      secondLink: false,
      thirdLink: false
    },
    {
      key: "review_score",
      name: "Review score",
      field: "review_score",
      sortOrder: false,
      type: "int",
      className: "div-table-col",
      secondLink: false,
      thirdLink: false
    },
    {
      key: "size",
      name: "Size (l)",
      field: "size",
      sortOrder: true,
      type: "float",
      className:"div-table-col",
      secondLink: false,
      thirdLink: false
    },
    {
      key: "price",
      name: "Price (euros)",
      field: "price",
      sortOrder: true,
      type: "float",
      className:"div-table-col",
      secondLink: false,
      thirdLink: false
    },
    {
      key: "max_availability",
      name: "Max stock (pcs)",
      field: "maxAvailability",
      sortOrder: false,
      type: "int",
      className:"div-table-col col-extra",
      secondLink: false,
      thirdLink: false
    },
    {
      key:"no_of_stores_with_availability",
      name: "# of stores with stock > 0",
      field: "noOfNearbyStoresWithAvailability",
      sortOrder: false,
      type: "int",
      className:"div-table-col col-extra",
      secondLink: false,
      thirdLink: false
    }
  ];
}
