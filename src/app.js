import React from 'react';
import ReactDOM from 'react-dom';
import {hashHistory, Router, Route, Redirect} from 'react-router';
import Layout from './layout/layout';
import IndexPage from './pages/indexpage';
import DrinkPage from './pages/drinkpage';
import IntroPage from './pages/intropage';
import {Provider} from 'react-redux';
import {createStore,applyMiddleware} from 'redux';
import rootReducer from './reducers';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';

const app = (
  <Router history={hashHistory}>
    <Redirect from="/" to="/intropage" />
    <Route path="/" component={Layout}>
      <Route path="intropage" component={IntroPage} />
      <Route path="indexpage" component={IndexPage} />
      <Route path="alco_drinks/:id" component={DrinkPage} />
    </Route>
  </Router>
)

const loggerMiddleware = createLogger();

const store = createStore(
  rootReducer,
  applyMiddleware(
    thunkMiddleware,
    loggerMiddleware
  )
);

ReactDOM.render(
  <Provider store={store}>
    {app}
  </Provider>, document.getElementById('craftbeer-app')
);
