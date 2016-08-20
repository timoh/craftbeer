import React from 'react';
import ReactDOM from 'react-dom';
import routes from './routes';
import {Provider} from 'react-redux';
import {createStore,applyMiddleware} from 'redux';
import rootReducer from './shared/rootReducer';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';

let middleware = [thunkMiddleware];

// only log to browser console in development
if(process.env.NODE_ENV !== 'production') {
  const loggerMiddleware = createLogger();
  middleware = [...middleware, loggerMiddleware];
}

const store = createStore(
  rootReducer,
  applyMiddleware(...middleware)
);

ReactDOM.render(
  <Provider store={store}>
    {routes}
  </Provider>, document.getElementById('craftbeer-app')
);
