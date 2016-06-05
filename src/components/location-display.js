import React from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import { getLocationAndDrinks } from '../actions';

const Location = (props) => (
  <div className="row">
    <div className="col-md-12 margin-bottom">
      <p className="centered">Welcome to Craftbeer app. This app needs to know your location so that it can show availability data from the Alko stores that are close to you.
      Do you allow the usage of your location?
      </p>
      <Link to="/indexpage">
        <button onClick={props.onButtonClick} className="btn btn-primary btn-middle btn-lg">Show all drinks</button>
      </Link>
    </div>
  </div>
);


const mapDispatchToLocationProps = (dispatch) => (
  {
    onButtonClick: () => (
      dispatch(getLocationAndDrinks())
    )
  }
);

const LocationDisplay = connect(
  null,
  mapDispatchToLocationProps
)(Location);

export default LocationDisplay;
