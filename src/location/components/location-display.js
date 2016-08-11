import React from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import { getLocation } from '../actions';
import ShowButton from './show-button';
import LocationText from './location-text';
import Tappable from 'react-tappable';
import PopularLocations from './popular';

class Location extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    let allowButton;
    if (!this.props.requested) {
      allowButton = (
        <Tappable component="button" className="btn btn-success btn-lg" onTap={this.props.onAllowButtonClick}>Use browser&#39;s location</Tappable>
      )
    }
    let typeAddressButton;
    if (!this.props.requested) {
      typeAddressButton = (
        <Link to="/addresspage" className="btn btn-info btn-lg">Let me type in my address</Link>
      )
    }
    let changeAddressButton;
    if (this.props.requested && !this.props.loading) {
      changeAddressButton = (
        <div className="row top30">
          <div className="col-md-6">
              <Link to="/addresspage" className="btn btn-info btn-md">Change my address</Link>
          </div>
        </div>
      )
    }

    let showButton;
    if (this.props.requested && !this.props.loading) {
      showButton = (<ShowButton cssClass="btn btn-primary btn-lg"/>)
    }
    let selectComment;
    if (!this.props.requested) {
      selectComment = (
        " Select whether you want to use your browser's location data or type in your address."
      )
    }
    return (
      <div className="row">
        <div className="col-md-12 margin-bottom">
          <div className="jumbotron">
            <div className="row">
              <div className="col-md-8">
                <h1>Welcome</h1>
                <p>This app needs to know your location so that it can show availability data from the Alko stores that are close to you. <br/>
                {selectComment}
                </p>
                <br/>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 margin-bottom">
                <PopularLocations />
              </div>
            </div>
            <div className="row">
              <div className="col-md-3 margin-bottom">
                {allowButton}
              </div>
              <div className="col-md-3">
                {typeAddressButton}
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <LocationText centered={false} address={this.props.address} loading={this.props.loading} requested={this.props.requested} latitude={this.props.myLocation[0].toFixed(2)} longitude={this.props.myLocation[1].toFixed(2)} />
              </div>
            </div>
            <div className="row top15">
              <div className="col-md-6">
                {showButton}
              </div>
            </div>
            {changeAddressButton}
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
