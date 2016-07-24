import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getPopularLocations } from '../actions';

export class Popular extends Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.dispatch(getPopularLocations());
  }

  render() {

    return(
      <div>
          <p>This here is a popular location:</p>
            <p>{ this.props.popularLocations }</p>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => (
  {
    dispatch: dispatch
  }
);

const mapStateToProps = state => (
  {
    popularLocations: state.positionData.popularLocations
  }
)

const PopularLocations = connect(
  mapStateToProps,
  mapDispatchToProps
)(Popular);

export default PopularLocations;
