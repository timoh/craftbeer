import React from 'react';
import HeaderDisplay from './table-header';

export default class TableHeaders extends React.Component {

  constructor(props) {
    super(props);
    this.handleOnClick = this.handleOnClick.bind(this);
  }

  handleOnClick(field,newSortOrder,type){
    this.props.sort(field,newSortOrder,type);
  }

  getHeaders() {
    // sortOrder = false on nouseva järjestys, sortOrder = true on laskeva järjestys. vaikuttaa sort-metodin reverse -parametriin.
    return  [
      {
        key: "selected",
        name: "Show selected on top",
        field: "selected",
        initialSortOrder: true,
        type: "boolean",
        className:"col-sm-2",
        secondLink: true,
        thirdLink: true
      },
      {
        key: "drink_title",
        name: "Drink title",
        field: "title",
        initialSortOrder: false,
        type: "string",
        className:"",
        secondLink: false,
        thirdLink: false
      },
      {
        key: "review_title",
        name: "Review title",
        field: "reviewTitle",
        initialSortOrder: false,
        type: "string",
        secondLink: false,
        thirdLink: false
      },
      {
        key: "match_score",
        name: "Match score",
        field: "best_rev_candidate_score",
        initialSortOrder: true,
        type: "float",
        secondLink: false,
        thirdLink: false
      },
      {
        key: "review_score",
        name: "Review score",
        field: "score",
        initialSortOrder: true,
        type: "int",
        secondLink: false,
        thirdLink: false
      },
      {
        key: "size",
        name: "Size (l)",
        field: "size",
        initialSortOrder: false,
        type: "float",
        className:"col-sm-1",
        secondLink: false,
        thirdLink: false
      },
      {
        key: "price",
        name: "Price (euros)",
        field: "price",
        initialSortOrder: false,
        type: "float",
        className:"col-sm-1",
        secondLink: false,
        thirdLink: false
      },
      {
        key: "max_availability",
        name: "Max availability in Alko (pcs)",
        field: "maxAvailability",
        initialSortOrder: true,
        type: "int",
        secondLink: false,
        thirdLink: false
      },
      {
        key:"no_of_stores_with_availability",
        name: "# of stores that have drink in stock",
        field: "noOfNearbyStoresWithAvailability",
        initialSortOrder: true,
        type: "int",
        className:"col-sm-1",
        secondLink: false,
        thirdLink: false
      }
    ];
  }

  render() {
    const headers = this.getHeaders();
    return(
      <thead>
        <tr>
          { headers.map((header) => {
              return (
                <HeaderDisplay onClick={this.handleOnClick} key={header.key} header={header} />
              )
            }) }
          <th>
            Top 3 nearest stores that have drink in stock
          </th>
        </tr>
      </thead>
    )
  }
}
