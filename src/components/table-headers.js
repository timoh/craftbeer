import React from 'react';
import TableHeader from '../components/table-header';

export default class TableHeaders extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
        headers: [
          {
            key: "drink_title",
            name: "Drink title",
            field: "title",
            initialSortOrder: false
          },
          {
            key: "review_title",
            name: "Review title",
            field: "title",
            initialSortOrder: false
          },
          {
            key: "match_score",
            name: "Match score",
            field: "best_rev_candidate_score",
            initialSortOrder: true
          },
          {
            key: "review_score",
            name: "Review score",
            field: "score",
            initialSortOrder: true
          },
          {
            key: "size",
            name: "Size",
            field: "size",
            initialSortOrder: false
          },
          {
            key: "price",
            name: "Price",
            field: "price",
            initialSortOrder: false
          },
          {
            key: "max_availability",
            name: "Max availability in Alko",
            field: "maxAvailability",
            initialSortOrder: true
          }
        ]
      };
      this.handleOnClick = this.handleOnClick.bind(this);
    }


  handleOnClick(field,newSortOrder){
    this.props.sort(field,newSortOrder);
  }

  render() {
    return(
      <thead>
        <tr>
          {this.state.headers.map(function (header) {
              return (
                <TableHeader onClick={this.handleOnClick} key={header.key} header={header} />
              )
            }.bind(this)
          )}
        </tr>
      </thead>
    )
  }
}
