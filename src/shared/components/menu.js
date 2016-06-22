import React from 'react';
import {Link} from 'react-router';

export default class Menu extends React.Component {

  render() {
    return(
        <nav className="navbar navbar-default navbar-fixed-top">
           <div className="navbar-header page-scroll">
              <Link to="/intropage" className="navbar-brand">Craftbeer</Link>
           </div>
        </nav>
    )
  }
}
