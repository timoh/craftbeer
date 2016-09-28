import React from 'react';
import ReactDOM from 'react-dom';
import routes from './routes';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware, compose} from 'redux';
import rootReducer from './shared/rootReducer';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import persistState from 'redux-localstorage';

let middleware = [thunkMiddleware];

// only log to browser console in development
if(process.env.NODE_ENV !== 'production') {
  const loggerMiddleware = createLogger();
  middleware = [...middleware, loggerMiddleware];
}

const enhancer = compose(
  applyMiddleware(...middleware),
  persistState()
);

const store = createStore(rootReducer, enhancer);

ReactDOM.render(
  <Provider store={store}>
    {routes}
  </Provider>, document.getElementById('craftbeer-app')
);
