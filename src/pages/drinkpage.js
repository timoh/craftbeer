import React from 'react';
import Drink from '../components/drink';
import {Link} from 'react-router';
export default class DrinkPage extends React.Component {
  render() {
    return(
      <section id="content">
        <div className="container">
          <div className="row">
            <div className="col-md-12 margin-bottom">
              <Link to="/indexpage" className="indexlink">
                Show all drinks
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
