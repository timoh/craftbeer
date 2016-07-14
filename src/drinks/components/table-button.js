import React from 'react';
import Tappable from 'react-tappable';

export default class TableButton extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showNonStocked: false
    };
  }

  handleClick() {
    const newValue = !this.state.showNonStocked;
    this.setState({
      showNonStocked: newValue
    });
    this.props.toggleNonStocked(newValue);
  }

  render() {
    let actionText;
    if (this.state.showNonStocked) {
      actionText = "Hide";
    } else {
      actionText = "Show";
    }
    return(
        <div>
          <Tappable component="button" className="btn btn-info btn-lg margin-on-mobile" onTap={this.handleClick.bind(this)}>{actionText} non-stocked</Tappable>
        </div>
    )
  }
}
