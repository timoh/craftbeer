import React from 'react';
import LocationDisplay from '../components/location-display';

export default class IntroPage extends React.Component {
  
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
