import React from 'react';
import Drink from './drink';

export class DrinkPage extends React.Component {

  render() {
    return(
      <section id="content">
        <div className="container">
          <div className="row">
            <Drink id={this.props.params.id} />
          </div>
        </div>
      </section>
    )
  }
}
