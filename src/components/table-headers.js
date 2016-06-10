import React from 'react';
import TableHeader from '../components/table-header';
import {connect} from 'react-redux';
import {selectAll,deSelectAll} from '../redux/actions';

class TableHeaders extends React.Component {

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
        key: "drink_title",
        name: "Drink title",
        field: "title",
        initialSortOrder: false,
        type: "string"
      },
      {
        key: "review_title",
        name: "Review title",
        field: "reviewTitle",
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
        name: "Size (l)",
        field: "size",
        initialSortOrder: false,
        type: "float"
      },
      {
        key: "price",
        name: "Price (euros)",
        field: "price",
        initialSortOrder: false,
        type: "float"
      },
      {
        key: "max_availability",
        name: "Max availability in Alko (pcs)",
        field: "maxAvailability",
        initialSortOrder: true,
        type: "int"
      },
      {
        key:"no_of_stores_with_availability",
        name: "# of stores that have drink in stock",
        field: "noOfNearbyStoresWithAvailability",
        initialSortOrder: true,
        type: "int"
      }
    ];
  }

  render() {
    const headers = this.getHeaders();
    return(
      <thead>
        <tr>
          <th>
            Select drinks: <br/>
            <span className="fake-link unselectable" onClick={this.props.handleSelectAll}>Select all</span> /
            <span className="fake-link unselectable" onClick={this.props.handleDeSelectAll}> Deselect all</span>
          </th>
          { headers.map((header) => {
              return (
                <TableHeader onClick={this.handleOnClick} key={header.key} header={header} />
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

const mapDispatchToHeadersProps = (dispatch) => (
  {
    handleSelectAll: () => (
      dispatch(selectAll())
    ),
    handleDeSelectAll: () => (
      dispatch(deSelectAll())
    ),
  }
);

const HeadersDisplay = connect(
  null,
  mapDispatchToHeadersProps
)(TableHeaders);

export default HeadersDisplay;
