import test from 'ava';
import {drinksReducer,locationReducer} from '../../src/redux/reducers';
import * as Actions from '../../src/redux/actions';
import chalk from 'chalk';
import * as JsDiff from 'diff';

let drink, drink2, drinkObj1, avail1, avail2, avails, reviews, store1, store2;

// warning!
// t.deepEqual() tests attribute order while prettyDiff() does not
function deepEqual(t, actual, expected) {
  t.deepEqual(actual, expected, prettyDiff(actual, expected));
}

function prettyDiff(actual, expected) {
  const diff = JsDiff.diffJson(expected, actual).map(part => {
    if (part.added) return chalk.green(part.value.replace(/.+/g, '    - $&'));
    if (part.removed) return chalk.red(part.value.replace(/.+/g, '    + $&'));
    return chalk.gray(part.value.replace(/.+/g, '    | $&'));
  }).join('');
  return `\n${diff}\n`;
}

test.beforeEach(t => {
    store1 = { _id: { $oid: "123" } };
    store2 = { _id: { $oid: "234" } };
    drink = {
      title: "test beer1",
      price: 4.18
    };
    drink2 = {
      title: "test beer2",
      price: 3.28
    };
    avail1 = {
      avail: {
        amount: 15
      },
      distance_in_m: 1500,
      store: store1,
      matchesDistanceCondition: true
    };
    avail2 = {
      avail: {
        amount: 50
      },
      distance_in_m: 5000,
      store: store2,
      matchesDistanceCondition: false
    };
    avails = [avail1,avail2];
    reviews = { score: 35,  title: "test beer in review" };
    drinkObj1 = {
      avails: avails,
      drink: drink,
      nearbyStoresWithAvailability: [avail1, avail2],
      selected: true,
      stocked: true,
      visible: true
    };
});

test('requests location', t => {
  const prevState = {
    position: [0.00, 0.00],
    loading: false,
    requested: false
  };
  const nextState = locationReducer(prevState,Actions.requestLocation());
  deepEqual(t,nextState, {
    position: [0.00, 0.00],
    loading: true,
    requested: true
  });
});

test('receives location', t => {
  const prevState = {
    position: [0.00, 0.00],
    loading: true,
    requested: true
  };
  const positionObj = {
    coords: {
      latitude: 60.10,
      longitude: 40.10
    }
  };
  const nextState = locationReducer(prevState,Actions.receiveLocation(positionObj));
  deepEqual(t,nextState, {
    position: [60.10, 40.10],
    loading: false,
    requested: true
  });
});

test('requests drinks', t => {
  const prevState = {
    loading: false,
    drinks: [],
    initialMaxDistance: 2000,
    storesWithSelectedDrinks: {}
  };
  const nextState = drinksReducer(prevState,Actions.requestDrinks());
  deepEqual(t,nextState, {
    loading: true,
    drinks: [],
    initialMaxDistance: 2000,
    storesWithSelectedDrinks: {}
  });
});

test('receives drinks', t => {
  const prevState = {
    loading: true,
    drinks: [],
    initialMaxDistance: 2000,
    storesWithSelectedDrinks: {}
  };
  const drinksArr = [
    {
      drink: drink
    },
    {
      drink: drink2
    }
  ];
  const nextState = drinksReducer(prevState,Actions.receiveDrinks(drinksArr));
  const correctState = {
    loading: true,
    drinks: drinksArr,
    initialMaxDistance: 2000,
    storesWithSelectedDrinks: {}
  };
  deepEqual(t,nextState, correctState);
});

test('adds additional data', t => {
  const prevState = {
    loading: true,
    drinks: [
      {
        avails: avails,
        drink: drink,
        reviews: reviews
      }
    ],
    initialMaxDistance: 2000,
    storesWithSelectedDrinks: {}
  };
  const nextState = drinksReducer(prevState,Actions.addAdditionalDataForDrinks());
  const drinksArr2 = [
    {
      avails: avails,
      drink: drink,
      reviews: reviews,
      score: 35,
      reviewTitle: "test beer in review",
      maxAvailability: 15,
      stocked: true,
      visible: true,
      noOfStoresMatchingDistanceCondition: 1,
      noOfNearbyStoresWithAvailability: 1,
      nearbyStoresWithAvailability: [avail1],
      selected: false
    }
  ];
  const correctState = {
    loading: false,
    drinks: drinksArr2,
    initialMaxDistance: 2000,
    storesWithSelectedDrinks: {}
  };
  deepEqual(t,nextState, correctState);
});

test('updates state after increasing max distance', t => {
  const prevState = {
    drinks: [
      {
        avails: avails,
        drink: drink,
        noOfStoresMatchingDistanceCondition: 1,
        noOfNearbyStoresWithAvailability: 1,
        nearbyStoresWithAvailability: [avail1],
        selected: true
      }
    ],
    initialMaxDistance: 2000,
    storesWithSelectedDrinks: {
      "123": avail1
    }
  };
  const nextState = drinksReducer(prevState,Actions.maxDistanceChange(7000));
  const avail3 = {
    ...avail2,
    matchesDistanceCondition: true
  };
  const drinksArr2 = [
    {
      avails: [avail1,avail3],
      drink: drink,
      maxAvailability: 50,
      stocked: true,
      selected: true,
      noOfStoresMatchingDistanceCondition: 2,
      noOfNearbyStoresWithAvailability: 2,
      nearbyStoresWithAvailability: [avail1,avail3]
    }
  ];
  const correctState = {
    drinks: drinksArr2,
    initialMaxDistance: 7000,
    storesWithSelectedDrinks: {
      "123": avail1,
      "234": avail3
    }
  };
  deepEqual(t,nextState, correctState);
});

test('updates state after decreasing max distance', t => {
  const prevState = {
    drinks: [
      {
        avails: avails,
        drink: drink,
        noOfStoresMatchingDistanceCondition: 2,
        noOfNearbyStoresWithAvailability: 2,
        nearbyStoresWithAvailability: [avail1,avail2],
        selected: true
      }
    ],
    initialMaxDistance: 7000,
    storesWithSelectedDrinks: {
      "123": avail1,
      "234": avail2
    }
  };
  const nextState = drinksReducer(prevState,Actions.maxDistanceChange(2000));

  const drinksArr2 = [
    {
      avails: avails,
      drink: drink,
      maxAvailability: 15,
      stocked: true,
      selected: true,
      noOfStoresMatchingDistanceCondition: 1,
      noOfNearbyStoresWithAvailability: 1,
      nearbyStoresWithAvailability: [avail1]
    }
  ];
  const correctState = {
    drinks: drinksArr2,
    initialMaxDistance: 2000,
    storesWithSelectedDrinks: {
      "123": avail1
    }
  };
  deepEqual(t,nextState, correctState);
});

test('sorts drinks based on title in descending order', t => {
  const prevState = {
    drinks: [
      {
        drink: drink,
      }, {
        drink: drink2
      }
    ]
  };
  const nextState = drinksReducer(prevState,Actions.sortDrinks("title",true,"string"));
  const correctState = {
    drinks: [
      {
        drink: drink2,
      }, {
        drink: drink
      }
    ]
  };
  deepEqual(t,nextState, correctState);
});

test('sorts drinks based on price in ascending order', t => {
  const prevState = {
    drinks: [
      {
        drink: drink,
      }, {
        drink: drink2
      }
    ]
  };
  const nextState = drinksReducer(prevState,Actions.sortDrinks("price",false,"float"));
  const correctState = {
    drinks: [
      {
        drink: drink2,
      }, {
        drink: drink
      }
    ]
  };
  deepEqual(t,nextState, correctState);
});

test('updates drinks after selecting a drink', t => {
  const drinkObj2 = {
    avails: avails,
    drink: drink2,
    nearbyStoresWithAvailability: [avail1],
    selected: false
  };
  const prevState = {
    drinks: [drinkObj1,drinkObj2],
    storesWithSelectedDrinks: {
      "123": avail1,
      "234": avail2
    }
  };
  const nextState = drinksReducer(prevState,Actions.checkedChange(drinkObj2));
  const drinkObj3 = {
    ...drinkObj2,
    selected: true
  };
  const correctState = {
    drinks: [drinkObj1,drinkObj3],
    storesWithSelectedDrinks: {
      "123": avail1
    }
  };
  deepEqual(t,nextState, correctState);
});

test('hides non-stocked drinks', t => {
  const drinkObj2 = {
    avails: [],
    drink: drink2,
    nearbyStoresWithAvailability: [],
    stocked: false,
    selected: true,
    visible: true
  };
  const prevState = {
    drinks: [drinkObj1,drinkObj2],
    storesWithSelectedDrinks: {}
  };
  const nextState = drinksReducer(prevState,Actions.showNonStockedChange(false));
  //immutability just in case …
  const drinkObj3 = {
    ...drinkObj2,
    selected: false,
    visible: false
  };
  const correctState = {
    drinks: [drinkObj1,drinkObj3],
    storesWithSelectedDrinks: {
      "123": avail1,
      "234": avail2
    }
  };
  deepEqual(t,nextState, correctState);
});

test('selects all drinks', t => {
  const drinkObj2 = {
    avails: [],
    drink: drink2,
    nearbyStoresWithAvailability: [],
    stocked: false,
    selected: false
  };
  const prevState = {
    drinks: [drinkObj1,drinkObj2],
    storesWithSelectedDrinks: {
      "123": avail1,
      "234": avail2
    }
  };
  const nextState = drinksReducer(prevState,Actions.selectAll());
  //immutability just in case …
  const drinkObj3 = {
    ...drinkObj2,
    selected: true
  };
  const correctState = {
    drinks: [drinkObj1,drinkObj3],
    storesWithSelectedDrinks: {}
  };
  deepEqual(t,nextState, correctState);
});

test('deselects all drinks', t => {
  const drinkObj2 = {
    avails: [avail1],
    drink: drink2,
    nearbyStoresWithAvailability: [avail1],
    stocked: true,
    selected: true
  };
  const prevState = {
    drinks: [drinkObj1,drinkObj2],
    storesWithSelectedDrinks: {
      "123": avail1
    }
  };
  const nextState = drinksReducer(prevState,Actions.deSelectAll());
  //immutability just in case …
  const drinkObj3 = {
    ...drinkObj1,
    selected: false
  };
  const drinkObj4 = {
    ...drinkObj2,
    selected: false
  };
  const correctState = {
    drinks: [drinkObj3,drinkObj4],
    storesWithSelectedDrinks: {}
  };
  deepEqual(t,nextState, correctState);
});
