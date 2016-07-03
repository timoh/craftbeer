import React from 'react';

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
          <button type="button" className="btn btn-primary" onClick={this.handleClick.bind(this)}>{actionText} non-stocked drinks</button>
        </div>
    )
  }
}