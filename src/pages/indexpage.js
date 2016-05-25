import React from 'react';
import DrinksContainer from '../components/drinks-container';

export default class IndexPage extends React.Component {
  render() {
    return(
      <section id="content">
        <div className="container">
          <DrinksContainer />
        </div>
      </section>
    )
  }
}
