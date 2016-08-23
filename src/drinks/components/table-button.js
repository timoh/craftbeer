import React from 'react';
import Tappable from 'react-tappable';
import {connect} from 'react-redux';

class TableButton extends React.Component {

  constructor(props) {
    super(props);
  }

  handleClick() {
    const newValue = !this.props.showNonStocked;
    this.props.toggleNonStocked(newValue);
  }

  render() {
    const actionText = this.props.showNonStocked ? "Hide" : "Show";

    return(
        <div>
          <Tappable component="button" className="btn btn-info btn-large margin-on-mobile btn-sm-on-mobile" onTap={this.handleClick.bind(this)}>{actionText} non-stocked</Tappable>
        </div>
    )
  }
}

const mapStateToTableButtonProps = state => (
  {
    showNonStocked: state.drinksData.showNonStocked
  }
)

const TableButtonDisplay = connect(
  mapStateToTableButtonProps,
  null
)(TableButton);

export default TableButtonDisplay;
