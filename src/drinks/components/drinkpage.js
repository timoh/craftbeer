import React from 'react';
import Drink from './drink';
import {Link} from 'react-router';

export class DrinkPage extends React.Component {

  render() {
    return(
      <section id="content">
        <div className="container">
          <div className="row">
            <div className="col-md-12 margin-bottom">
              <Link to="/indexpage" className="indexlink">
                Show all drinks
              </Link>
              <span> |  </span>
              <Link to="/storespage" className="indexlink">
                 Show stores with selected drinks
              </Link>
            </div>
          </div>
          <div className="row">
            <Drink id={this.props.params.id} />
          </div>
        </div>
      </section>
    )
  }
}
