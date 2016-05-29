import React from 'react';
import {Link} from 'react-router';
import CurrentLocation from '../current-location';

export default class LocationContainer extends React.Component {

  constructor() {
    super();
    this.state = {
      myLocation: [0.00, 0.00]
    };
  }

  loadLocation(callback) {
    var currentLoc = new CurrentLocation();
    currentLoc.getLocation(callback);
  }

  storeLocation(position){
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    // this.props.state ... 
    this.setState({myLocation: [latitude, longitude] });
  }

  componentWillMount() {
    this.loadLocation(this.storeLocation.bind(this));
  }

  render() {

    return(
          <div className="row">
            <div className="col-md-12 margin-bottom">
              <p className="centered">Welcome to Craftbeer app. This app needs to know your location so that it can show availability data from the Alko stores that are close to you.
              Do you allow the usage of your location?
              </p>

              <p>This is your location: lat: {this.state.myLocation[0]}, lng: {this.state.myLocation[1]}</p>
              <Link to="/indexpage">
                <button className="btn btn-primary btn-middle btn-lg">Show all drinks</button>
              </Link>
            </div>
          </div>
      )
    }


}
