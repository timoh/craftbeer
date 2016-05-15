import React from 'react';
import ReactDOM from 'react-dom';
import {hashHistory, Router, Route, Redirect} from 'react-router';
import Layout from './layout/layout'
import IndexPage from './pages/indexpage'
import DrinkPage from './pages/drinkpage'

const app = (
  <Router history={hashHistory}>
    <Redirect from="/" to="/indexpage" />
    <Route path="/" component={Layout}>
      <Route path="indexpage" component={IndexPage} />
      <Route path="alco_drinks/:id" component={DrinkPage} />
    </Route>
  </Router>
)

ReactDOM.render(
  app, document.getElementById('craftbeer-app')
);
