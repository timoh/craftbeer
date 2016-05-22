import React from 'react';
import DrinkTable from '../components/drink-table';
import Slider from '../components/slider';
import SearchButton from '../components/search-button';

export default class IndexPage extends React.Component {
  render() {
    return(
      <section id="content">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <Slider min="0" max="10000" step="100" />
            </div>
          </div>
          <DrinkTable />
          <SearchButton />
        </div>
      </section>
    )
  }
}
