import React from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import { getLocation } from '../actions';

class Location extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    let locationText;
    if (this.props.requested) {
      if (this.props.loading) {
        locationText = (
          <p className="centered">Loading location...</p>
        )
      } else {
        locationText = (
            <p className="centered"><strong>This is your location:</strong> <br/>
            {this.props.address}
            </p>
        )
      }
    }
    let allowButton;
    if (!this.props.requested) {
      allowButton = (
        <button onClick={this.props.onAllowButtonClick} className="btn btn-success btn-middle btn-md">Yes</button>
      )
    }
    let showButton;
    if (this.props.requested && !this.props.loading) {
      showButton = (
        <Link to="/indexpage" className="btn btn-primary btn-middle btn-lg">Show all drinks with availability data based on your location</Link>
      )
    }
    return (
      <div className="row">
        <div className="col-md-12 margin-bottom">
          <p className="centered">Welcome to Craftbeer app. This app needs to know your location so that it can show availability data from the Alko stores that are close to you.
          Do you allow the usage of your location?
          </p>
          <br/>
          {allowButton}
          {locationText}
          {showButton}
        </div>
      </div>
    )
  }
};

const mapDispatchToLocationProps = (dispatch) => (
  {
    onAllowButtonClick: () => (
      dispatch(getLocation())
    ),
    dispatch: dispatch
  }
);

const mapStateToLocationProps = state => (
  {
    myLocation: state.positionData.position,
    loading: state.positionData.loading,
    requested: state.positionData.requested,
    address: state.positionData.address
  }
)

const LocationDisplay = connect(
  mapStateToLocationProps,
  mapDispatchToLocationProps
)(Location);

export default LocationDisplay;
