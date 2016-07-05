import React from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import { getLocation } from '../actions';
import ShowButton from './show-button';
import LocationText from './location-text';

class Location extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    let allowButton;
    if (!this.props.requested) {
      allowButton = (
        <button onClick={this.props.onAllowButtonClick} className="btn btn-success btn-lg btn-custom-lg">Use browser's location</button>
      )
    }
    let typeAddressButton;
    if (!this.props.requested) {
      typeAddressButton = (
        <Link to="/addresspage" className="btn btn-info btn-lg btn-custom-lg">Let me type in my address</Link>
      )
    }
    let changeAddressButton;
    if (this.props.requested && !this.props.loading) {
      changeAddressButton = (
        <div className="row">
          <div className="col-md-6 col-md-offset-3">
              <Link to="/addresspage" className="btn btn-info location-btn-middle btn-lg">Change my address</Link>
          </div>
        </div>
      )
    }

    let showButton;
    if (this.props.requested && !this.props.loading) {
      showButton = (<ShowButton/>)
    }
    let guidingComment;
    if (!this.props.requested) {
      guidingComment = (
        " Select whether you want to use your browser's location data or type in your address."
      )
    }
    return (
      <div className="row">
        <div className="col-md-12 margin-bottom">
          <div className="row">
            <div className="col-md-8 col-md-offset-3">
              <p>Welcome to Craftbeer app. This app needs to know your location so that it can show availability data from the Alko stores that are close to you. <br/>
              {guidingComment}
              </p>
              <br/>
            </div>
          </div>
          <div className="row">
            <div className="col-md-4 col-md-offset-3 col-xs-6">
              {allowButton}
            </div>
            <div className="col-md-4 col-xs-6">
              {typeAddressButton}
            </div>
          </div>
          <div className="row">
              <LocationText address={this.props.address} loading={this.props.loading} requested={this.props.requested} latitude={this.props.myLocation[0].toFixed(2)} longitude={this.props.myLocation[1].toFixed(2)} />
          </div>
          {changeAddressButton}
          <div className="row top15">
            <div className="col-md-6 col-md-offset-3">
              {showButton}
            </div>
          </div>
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
