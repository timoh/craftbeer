import React from 'react';
import LocationContainer from '../components/location-container';

export default class IntroPage extends React.Component {
  render() {
    return(
      <section id="content">
        <div className="container">
          <LocationContainer />
        </div>
      </section>
    )
  }
}
