import React from 'react';
import {Link} from 'react-router';

export default class ShowButton extends React.Component {

  render() {
    return (
      <Link to="/indexpage" className="btn btn-primary location-btn-middle btn-lg">Show all drinks & their availability</Link>
    )
  }
}
