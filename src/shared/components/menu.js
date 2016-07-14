import React from 'react';
import {Link} from 'react-router';

export default class Menu extends React.Component {

  render() {
    const links = [
      {
        title: "Your Location",
        url: "/intropage",
        className: "page-scroll"
      },
      {
        title: "All Drinks",
        url: "/indexpage",
        className: "page-scroll"
      },
      {
        title: "Stores with selected drinks",
        url: "/storespage",
        className: "page-scroll"
      }
    ];
    links.map((link) => {
      link.className = link.url === this.props.currentRoute ? link.className + " active" : link.className;
    });
    return(
        <nav className="navbar navbar-default navbar-fixed-top">
          <div className="container">
            <div className="row">
              <div className="col-md-6 col-xs-3 navbar-header">
                <Link to="/intropage" className="navbar-brand">Craftbeer</Link>
              </div>
              <div className="col-md-6 col-xs-9 collapse navbar-collapse">
                <ul className="nav navbar-nav navbar-right">
                   {links.map( link =>
                     (
                       <li key={link.url} className={link.className}>
                         <Link to={link.url}>{link.title}</Link>
                       </li>
                     )
                   )}
                </ul>
              </div>
            </div>
          </div>
        </nav>
    )
  }
}
