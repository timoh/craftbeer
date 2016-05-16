import React from 'react';

export default class TableHeader extends React.Component {

  sort(field){
   this.props.sort(field);
  }

  render() {
    return(
      <thead>
        <tr>
          <th>
            <a href="#" onClick={this.sort.bind(this,'title')}>Drink title</a>
          </th>
          <th>
            <a href="#" onClick={this.sort.bind(this,'title')}>Review title</a>
          </th>
          <th>
            <a href="#" onClick={this.sort.bind(this,'best_rev_candidate_score')}> Match score</a>
          </th>
          <th>
            <a href="#" onClick={this.sort.bind(this,'score')}> Review score</a>
          </th>
          <th>
            <a href="#" onClick={this.sort.bind(this,'size')}> Size</a>
          </th>
          <th>
            <a href="#" onClick={this.sort.bind(this,'price')}> Price</a>
          </th>
          <th>
            <a href="#" onClick={this.sort.bind(this,'maxAvailability')}> Max availability in Alko</a>
          </th>
        </tr>
      </thead>
    )
  }
}
