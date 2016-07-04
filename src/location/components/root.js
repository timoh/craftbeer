import React from 'react';
import LocationDisplay from './location-display';

export class Root extends React.Component {

  render() {
    return(
      <section id="content">
        <div className="container">
          <LocationDisplay />
        </div>
      </section>
    )
  }
}
