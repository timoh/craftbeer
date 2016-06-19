import React from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import { getLocation,fetchDrinks } from '../redux/actions';

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
            <p className="centered">This is your location: lat: {this.props.myLocation[0].toFixed(2)}, lng: {this.props.myLocation[1].toFixed(2)}</p>
        )
      }
    }
    let allowButton;
    if (!this.props.requested) {
      allowButton = (
        <button onClick={this.props.onAllowButtonClick} className="btn btn-success btn-middle btn-md">Yes</button>
      )
    }
    let typeAddressButton;
    if (!this.props.requested) {
      typeAddressButton = (
        <Link to="/typeaddress" onClick={this.props.onTypeAddressClick} className="btn btn-info btn-middle btn-lg">Type address</Link>
      )
    }
    let showButton;
    if (this.props.requested && !this.props.loading) {
      showButton = (
        <Link to="/indexpage" onClick={this.props.onShowButtonClick} className="btn btn-primary btn-middle btn-lg">Show all drinks</Link>
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
          {typeAddressButton}
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
    onShowButtonClick: () => (
      dispatch(fetchDrinks(false))
    ),
    dispatch: dispatch
  }
);

const mapStateToLocationProps = state => (
  {
    myLocation: state.positionData.position,
    loading: state.positionData.loading,
    requested: state.positionData.requested
  }
)

const LocationDisplay = connect(
  mapStateToLocationProps,
  mapDispatchToLocationProps
)(Location);

export default LocationDisplay;
