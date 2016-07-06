import React from 'react';
import {Link} from 'react-router';

export default class ShowButton extends React.Component {

  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Link to="/indexpage" className={this.props.cssClass}>Show all drinks & their availability</Link>
    )
  }
}
