import React from 'react';
import DrinkTable from '../components/drink-table'

export default class IndexPage extends React.Component {
  render() {
    return(
      <section id="content">
        <div className="container">
          <DrinkTable />
        </div>
      </section>
    )
  }
}
