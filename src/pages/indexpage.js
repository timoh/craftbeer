import React from 'react';
import DrinksDisplay from '../components/drinks-display';

export default class IndexPage extends React.Component {
  
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
