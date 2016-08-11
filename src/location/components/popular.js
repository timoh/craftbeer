import React, { Component } from 'react';
import { connect } from 'react-redux';
import { searchForPopularLocation, getPopularLocations } from '../actions';

export class Popular extends Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.dispatch(getPopularLocations());
  }

  submitAddress(location) {
    this.props.searchForPopularLocation(location);
  }

  renderLocationList() {
    return this.props.popularLocations.map((location) => {
      return (
          <a key={location.address} className="list-group-item underline" href="#" onClick={ () => this.submitAddress(location) }>{location.address}</a>
      );
    })
  }

  render() {
    return(
      <div>
          <p>Popular locations:</p>
            <div className="list-group">{ this.renderLocationList() }</div>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => (
  {
    dispatch: dispatch,
    searchForPopularLocation: (location) => (
      dispatch(searchForPopularLocation(location.address))
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
