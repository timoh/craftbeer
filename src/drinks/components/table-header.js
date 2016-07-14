import React from 'react';
import {selectAll,deSelectAll} from '../actions';
import {connect} from 'react-redux';
import Tappable from 'react-tappable';

export default class TableHeader extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      sortOrder: props.header.initialSortOrder
    };
  }

  handleOnClick(){
    const newSortOrder = this.props.header.field ==="selected" ? true : !this.state.sortOrder;
    this.setState({
      sortOrder: newSortOrder
    });
    this.props.onClick(this.props.header.field,this.state.sortOrder,this.props.header.type);
  }

  render() {
    let secondLink;
    if (this.props.header.secondLink) {
      secondLink = (
        <div>
         <Tappable className="fake-link unselectable" onTap={this.props.handleSelectAll}>Select all</Tappable>
        </div>
      )
    }
    let thirdLink;
    if (this.props.header.thirdLink) {
      thirdLink = (
        <div>
         <Tappable className="fake-link unselectable" onTap={this.props.handleDeSelectAll}>Deselect all</Tappable>
        </div>
      )
    }
    return (
      <th className={this.props.header.className}>
        <Tappable className="fake-link unselectable" onTap={this.handleOnClick.bind(this)}>{this.props.header.name}</Tappable>
        {secondLink}
        {thirdLink}
      </th>
    )
  }
}

const mapDispatchToHeaderProps = (dispatch) => (
  {
    handleSelectAll: () => (
      dispatch(selectAll())
    ),
    handleDeSelectAll: () => (
      dispatch(deSelectAll())
    ),
  }
);

const HeaderDisplay = connect(
  null,
  mapDispatchToHeaderProps
)(TableHeader);

export default HeaderDisplay;
