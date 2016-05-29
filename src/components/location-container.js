import React from 'react';
import {Link} from 'react-router';

export default class LocationContainer extends React.Component {
  render() {
    return(
        <div className="row">
          <div className="col-md-12 margin-bottom">
            <p className="centered">Welcome to Craftbeer app. This app needs to know your location so that it can show availability data from the Alko stores that are close to you.
            Do you allow the usage of your location?
            </p>
            <Link to="/indexpage">
              <button className="btn btn-primary btn-middle btn-lg">Show all drinks</button>
            </Link>
          </div>
        </div>
    )
  }
}
