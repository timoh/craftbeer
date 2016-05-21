import React from 'react';
import TableHeader from '../components/table-header';
import update from 'react-addons-update';

export default class TableHeaders extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      //first click toggles sortOrder to correct initial sort order. not the best implementation perhaps...
        headers: [
          {
            key: "drink_title",
            name: "Drink title",
            field: "title",
            sortOrder: true
          },
          {
            key: "review_title",
            name: "Review title",
            field: "title",
            sortOrder: true
          },
          {
            key: "match_score",
            name: "Match score",
            field: "best_rev_candidate_score",
            sortOrder: false
          },
          {
            key: "review_score",
            name: "Review score",
            field: "score",
            sortOrder: false
          },
          {
            key: "size",
            name: "Size",
            field: "size",
            sortOrder: true
          },
          {
            key: "price",
            name: "Price",
            field: "price",
            sortOrder: true
          },
          {
            key: "max_availability",
            name: "Max availability in Alko",
            field: "maxAvailability",
            sortOrder: false
          }
        ]
      }
      this.handleOnClick = this.handleOnClick.bind(this);
    }

  toggleSortOrder(key) {
    const index = this.getHeaderIndex(key);
    const headers = this.state.headers;
    var header = this.state.headers[index];
    header.sortOrder = !header.sortOrder;
    const updatedHeaders = update(headers, { $splice: [[index, 1, header]] });
    this.setState({
      headers: updatedHeaders
    })
    return header.sortOrder;
  }
  getHeaderIndex(key) {
    return this.state.headers.map(function(headerInState)
        {
          return headerInState.key;
        }).indexOf(key);
  }

  handleOnClick(field,key){
    const newSortOrder = this.toggleSortOrder(key);
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
