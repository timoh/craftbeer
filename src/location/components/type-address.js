import React from 'react';
import {connect} from 'react-redux';
import { geocodeAddress, inputAddress } from '../actions';
import ShowButton from './show-button';
import LocationText from './location-text';

class Address extends React.Component {

  render() {
    const onAddressInput = (event) => {
      this.props.onInput(event.target.value);
    };

    let showButton;
    if (this.props.requested && !this.props.loading) {
      showButton = (<ShowButton/>)
    }
    return (
      <div className="row">
        <div className="col-md-12 margin-bottom">
          <div className="row">
            <div className="col-md-6 col-md-offset-3">
              <p className="centered">Type in your address:</p>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 col-md-offset-3 margin-bottom">
              <input type="text" className="form-control input-lg centered" name="addressInput" defaultValue={this.props.address} onBlur={onAddressInput} />
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 col-md-offset-3">
              <button onClick={this.props.submitAddressButtonClick} className="btn btn-success btn-middle btn-lg">Locate me</button>
            </div>
          </div>
          <div className="row top30">
            <div>
              <LocationText loading={this.props.loading} requested={this.props.requested} latitude={this.props.myLocation[0].toFixed(2)} longitude={this.props.myLocation[1].toFixed(2)} />
              {showButton}
            </div>
          </div>
        </div>
      </div>
    )
  }
};

const mapDispatchToAddressProps = (dispatch) => (
  {
    submitAddressButtonClick: () => (
      dispatch(geocodeAddress())
    ),
    onInput: (address) => (
      dispatch(inputAddress(address))
    )
  }
);

const mapStateToAddressProps = state => (
  {
    address: state.positionData.address,
    loading: state.positionData.loading,
    requested: state.positionData.requested,
    myLocation: state.positionData.position
  }
)

const TypeAddress = connect(
  mapStateToAddressProps,
  mapDispatchToAddressProps
)(Address);

export default TypeAddress;