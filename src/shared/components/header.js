import React from 'react';

export default class Header extends React.Component {

  render() {
    return(
        <header>
          <div className="container">
            <div className="row">
              <div className="col-lg-12 col-xs-12">
                <div className="intro-text">
                  <span className="name">Pick your poison</span>
                </div>
              </div>
            </div>
          </div>
       </header>
    )
  }
}
