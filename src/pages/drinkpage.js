import React from 'react';
import Drink from '../components/drink';
import {Link} from 'react-router';
export default class DrinkPage extends React.Component {
  render() {
    return(
      <section id="content">
        <Link to="/">Show all drinks</Link>
        <div className="container">
          <Drink id={this.props.params.id} />
        </div>
      </section>
    )
  }
}
