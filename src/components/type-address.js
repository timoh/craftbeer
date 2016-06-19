import React from 'react';
// import {Link} from 'react-router';
// import {connect} from 'react-redux';
// import { getLocation,fetchDrinks } from '../redux/actions';

class Address extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {

    let addressInputField;
    addressInputField = (
      <input type="text" name="addressInput" />
    )

    let submitAddressButton;
    allowButton = (
      <button onClick={this.props.submitAddressButtonClick} className="btn btn-success btn-middle btn-md">Submit address</button>
    )

    return (
      <div className="row">
        <div className="col-md-12 margin-bottom">
          <p className="centered">Lets type in your address</p>
          {addressInputField}
          {submitAddressButton}
          <br/>
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
    dispatch: dispatch
  }
);

const TypeAddress = connect(
  mapDispatchToAddressProps
)(Address);

export default TypeAddress;
