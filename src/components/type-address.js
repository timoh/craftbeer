import React from 'react';
// import {Link} from 'react-router';
import {connect} from 'react-redux';
import { geocodeAddress } from '../redux/actions';

class Address extends React.Component {

  constructor(props) {
    super(props);
    this.state = { address: ''};
  }

  render() {

    let addressInputField;
    addressInputField = (
      <input type="text" name="addressInput" value={this.state.address} onChange={event => this.setState({address: event.target.value})} />
    )

    let submitAddressButton;
    submitAddressButton = (
      <button onClick={this.props.submitAddressButtonClick(this.state.address)} className="btn btn-success btn-middle btn-md">Submit address</button>
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
    submitAddressButtonClick: (address) => (
      dispatch(geocodeAddress(address)),
      console.log("Now geocoding!"),
      console.log(dispatch)
    ),
    dispatch: dispatch
  }
);

const mapStateToAddressProps = state => (
  {
    address: state.address
  }
)

const TypeAddress = connect(
  mapStateToAddressProps,
  mapDispatchToAddressProps
)(Address);

export default TypeAddress;
