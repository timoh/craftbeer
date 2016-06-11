import React from 'react';
import {selectAll,deSelectAll} from '../redux/actions';
import {connect} from 'react-redux';

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
         \ <span className="fake-link unselectable" onClick={this.props.handleSelectAll}>Select all</span>
        </div>
      )
    }
    let thirdLink;
    if (this.props.header.thirdLink) {
      thirdLink = (
        <div>
         \ <span className="fake-link unselectable" onClick={this.props.handleDeSelectAll}>Deselect all</span>
        </div>
      )
    }
    return (
      <th className={this.props.header.className}>
        <span className="fake-link unselectable" onClick={this.handleOnClick.bind(this)}>{this.props.header.name}</span>
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
