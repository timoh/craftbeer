import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getPopularLocations, inputAddress } from '../actions';

export class Popular extends Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.dispatch(getPopularLocations());
  }

  renderLocationList() {
    return this.props.popularLocations.map((location) => {
      return (
        <li><a key={location.address} onClick={ () => this.props.searchForPopularLocation(location) } >{location.address}</a></li>
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

const mapDispatchToProps = (dispatch) => (
  {
    dispatch: dispatch,
    searchForPopularLocation: (location) => (
      dispatch(inputAddress(location.address))
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
)(Popular);

export default PopularLocations;
