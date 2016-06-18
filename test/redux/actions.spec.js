import test from 'ava';
import nock from 'nock';
import configureStore from 'redux-mock-store';
import thunkMiddleware from 'redux-thunk';
import {fetchDrinks,receiveDrinks} from '../../src/redux/actions';

test('fetchDrinks action', t => {
  return new Promise((resolve, reject) => {
    const data = [
      {
         "drink":{
            "_id":{
               "$oid":"56261f10093908b19f0003e8"
            },
            "alko_id":"781706",
            "best_rev_candidate_score":1.0,
            "created_at":"2015-10-20T11:01:36.432Z",
            "price":3.28,
            "size":0.5,
            "title":"Baltika 4 Original",
            "type":"tumma lager",
            "updated_at":"2015-10-20T11:02:13.137Z",
            "url":"http://www.alko.fi/tuotteet/781706"
         },
         "avails":[
            {
               "avail":{
                  "_id":{
                     "$oid":"5747037062f4e00440a9b8ba"
                  },
                  "alco_drink_id":{
                     "$oid":"56261f10093908b19f0003e8"
                  },
                  "alco_location_id":{
                     "$oid":"56261f11093908b19f00053d"
                  },
                  "amount":16,
                  "created_at":"2016-05-26T14:08:48.601Z",
                  "history":null,
                  "last_updated":null,
                  "updated_at":"2016-05-26T14:08:48.601Z"
               },
               "store":{
                  "_id":{
                     "$oid":"56261f11093908b19f00053d"
                  },
                  "address":"Vanha Talvitie 12",
                  "alko_store_id":2138,
                  "city":"Helsinki",
                  "created_at":"2015-10-20T11:01:37.873Z",
                  "loc_name":"Helsinki Kalasatama",
                  "location":[
                     24.9771417,
                     60.19204116
                  ],
                  "postal_code":"00580",
                  "store_link":"/myymalat-palvelut/2138/",
                  "updated_at":"2016-05-22T14:56:54.515Z",
                  "url":null
               },
               "distance_in_m":5375.899877752226
            }
         ],
         "reviews":{
            "_id":{
               "$oid":"56261f0e093908b19f000073"
            },
            "alco_drink_id":{
               "$oid":"56261f10093908b19f0003e8"
            },
            "company":"Baltika Brewery (Baltic Beverages Holdings)",
            "created_at":"2015-10-20T11:01:34.781Z",
            "score":27,
            "title":"Baltika 4 Original",
            "type":null,
            "updated_at":"2015-10-20T11:02:13.135Z",
            "url":"http://olutopas.info/olut/841/baltika-4-original"
         }
      }
    ];
    const mockStore = configureStore([thunkMiddleware]);
    const lat = 60.1688202;
    const lon = 24.9337834;
    const store = mockStore({
      drinks: [],
      positionData: {
        position:[lat,lon]
      }
    });
    const expectedActions = [
      { type: 'REQUEST_DRINKS'},
      { type: 'RECEIVE_DRINKS', drinks: data},
      { type: 'ADD_ADDITIONAL_DATA'}
    ];
    const endpoint = '/home/distanced?lat=' +lat+ '&lng=' +lon;
    const api = nock('http://localhost:3000/')
      .get(endpoint)
      .reply(200, data);
    store.dispatch(fetchDrinks(true))
      .then(() => {
        t.deepEqual(store.getActions(), expectedActions);
        resolve();
      });
  });
});
