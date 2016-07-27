import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router'
import { getPopularLocations, inputAddress, geocodeAddress, getLocation} from '../actions';

export class Popular extends Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.dispatch(getPopularLocations());
  }

  submitAddress(location) {
    this.props.searchForPopularLocation(location);
    this.props.router.push('/indexpage');
  }

  renderLocationList() {
    return this.props.popularLocations.map((location) => {
      return (
        <li key={location.address}><a onClick={ () => this.submitAddress(location) } >{location.address}</a></li>
      );
    })
  }

  render() {
    return(
      <div>
          <p>Popular locations:</p>
            <ul>{ this.renderLocationList() }</ul>
      </div>
    )
  }
}

const PopularWithRouter = withRouter(Popular);

const mapDispatchToProps = (dispatch) => (
  {
    dispatch: dispatch,
    searchForPopularLocation: (location) => (
      dispatch(inputAddress(location.address)),
      dispatch(geocodeAddress()),
      dispatch(getLocation())
    )
  }
);

const mapStateToProps = state => (
  {
    popularLocations: state.positionData.popularLocations,
    address: state.positionData.address
  }
)

const PopularLocations = connect(
  mapStateToProps,
  mapDispatchToProps
)(PopularWithRouter);

export default PopularLocations;
