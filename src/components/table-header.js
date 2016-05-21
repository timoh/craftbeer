import React from 'react';

export default class TableHeader extends React.Component {

  constructor(props) {
    super(props);
  }

  handleOnClick(){
    this.props.onClick(this.props.header.field,this.props.header.key);
  }

  render() {
    return(
      <th>
        <a href="#" onClick={this.handleOnClick.bind(this)}>{this.props.header.name}</a>
      </th>
    )
  }
}
