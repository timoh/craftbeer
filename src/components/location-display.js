import React from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import { getLocation,fetchDrinks } from '../redux/actions';

class Location extends React.Component {

  constructor(props) {
    super(props);
  }

  componentWillMount(){
    this.props.dispatch(getLocation());
  }

  render() {
    return (
      <div className="row">
        <div className="col-md-12 margin-bottom">
          <p className="centered">Welcome to Craftbeer app. This app needs to know your location so that it can show availability data from the Alko stores that are close to you.
          Do you allow the usage of your location?
          </p>
          <p>This is your location: lat: {this.props.myLocation[0]}, lng: {this.props.myLocation[1]}</p>
          <Link to="/indexpage">
            <button onClick={this.props.onButtonClick} className="btn btn-primary btn-middle btn-lg">Show all drinks</button>
          </Link>
        </div>
      </div>
    )
  }
};


const mapDispatchToLocationProps = (dispatch) => (
  {
    onButtonClick: () => (
      dispatch(fetchDrinks())
    ),
    dispatch: dispatch
  }
);

const mapStateToLocationProps = state => (
  {
    myLocation: state.positionData.position
  }
)

const LocationDisplay = connect(
  mapStateToLocationProps,
  mapDispatchToLocationProps
)(Location);

export default LocationDisplay;
