import React from 'react';
import {hashHistory,Router,Route,Redirect} from 'react-router';
import * as shared from './shared';
import * as location from './location';
import * as drinks from './drinks';
import * as stores from './stores';

export default (
  <Router history={hashHistory}>
    <Redirect from="/" to="/intropage" />
    <Route path="/" component={shared.Root}>
      <Route path="intropage" component={location.components.Root} />
      <Route path="addresspage" component={location.components.AddressPage} />
      <Route path="indexpage" component={drinks.components.Root} />
      <Route path="storespage" component={stores.Root} />
      <Route path="alco_drinks/:id" component={drinks.components.DrinkPage} />
    </Route>
  </Router>
)
