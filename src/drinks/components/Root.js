import React from 'react';
import DrinksDisplay from './drinks-display';

export class Root extends React.Component {


  render() {
    return(
      <section id="content">
        <div className="container">
          <DrinksDisplay />
        </div>
      </section>
    )
  }
}
