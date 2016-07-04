import React from 'react';
import StoresDisplay from './stores-display';

export class Root extends React.Component {


  render() {
    return(
      <section id="content">
        <div className="container">
          <div className="row">
            <StoresDisplay />
          </div>
        </div>
      </section>
    )
  }
}
