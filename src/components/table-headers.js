import React from 'react';
import TableHeader from '../components/table-header';

export default class TableHeaders extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      // sortOrder = false on nouseva järjestys, sortOrder = true on laskeva järjestys. vaikuttaa sort-metodin reverse -parametriin.
        headers: [
          {
            key: "drink_title",
            name: "Drink title",
            field: "title",
            initialSortOrder: false,
            type: "string"
          },
          {
            key: "review_title",
            name: "Review title",
            field: "title",
            initialSortOrder: false,
            type: "string"
          },
          {
            key: "match_score",
            name: "Match score",
            field: "best_rev_candidate_score",
            initialSortOrder: true,
            type: "float"
          },
          {
            key: "review_score",
            name: "Review score",
            field: "score",
            initialSortOrder: true,
            type: "int"
          },
          {
            key: "size",
            name: "Size",
            field: "size",
            initialSortOrder: false,
            type: "float"
          },
          {
            key: "price",
            name: "Price",
            field: "price",
            initialSortOrder: false,
            type: "float"
          },
          {
            key: "max_availability",
            name: "Max availability in Alko",
            field: "maxAvailability",
            initialSortOrder: true,
            type: "int"
          },
          {
            key:"no_of_stores_with_availability",
            name: "# of stores that have beer in stock",
            field: "noOfNearbyStoresWithAvailability",
            initialSortOrder: true,
            type: "int"
          },
          {
            key:"no_of_stores_matching_distance_condition",
            name: "# of stores that match the distance condition",
            field: "noOfStoresMatchingDistanceCondition",
            initialSortOrder: true,
            type: "int"
          }
        ]
      };
      this.handleOnClick = this.handleOnClick.bind(this);
    }


  handleOnClick(field,newSortOrder,type){
    this.props.sort(field,newSortOrder,type);
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
