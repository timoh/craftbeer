import React from 'react';
import {Link} from 'react-router';

export default class ShowButton extends React.Component {

  render() {
    return (
      <Link to="/indexpage" className="btn btn-primary btn-middle btn-lg">Show all drinks with availability data based on your location</Link>
    )
  }
}
