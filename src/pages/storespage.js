import React from 'react';
import StoresDisplay from '../components/stores-display';
import {Link} from 'react-router';

export default class StoresPage extends React.Component {
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
            <StoresDisplay />
          </div>
        </div>
      </section>
    )
  }
}
