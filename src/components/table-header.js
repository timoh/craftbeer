import React from 'react';

export default class TableHeader extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      sortOrder: props.header.initialSortOrder
    };
  }

  handleOnClick(){
    this.setState({
      sortOrder: !this.state.sortOrder
    });
    this.props.onClick(this.props.header.field,this.state.sortOrder,this.props.header.type);
  }

  render() {
    return(
      <th>
        <a href="#" onClick={this.handleOnClick.bind(this)}>{this.props.header.name}</a>
      </th>
    )
  }
}
