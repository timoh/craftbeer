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

  render() {

    return(
        <div className="div-table-headers bolded">
              { this.props.headers.map((header) => {
                    return (
                      <HeaderDisplay onClick={this.handleOnClick} key={header.key} header={header} />
                    )
                }) }
                <div className="div-table-col col-extra">
                  Top 3 nearest stores with stock > 0
                </div>
        </div>

    )
  }
}
