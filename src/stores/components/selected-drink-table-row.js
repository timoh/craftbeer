import React from 'react';
import Tappable from 'react-tappable';

export default class SelectedDrinkTableRow extends React.Component {

  constructor(props) {
    super(props);
  }

  onClick() {
    this.props.onClick(this.props.drinkData);
  }

  render() {
    return (
      <Tappable component="tr" key={this.props.drinkData.drink._id.$oid} className={this.props.selected ? "active-table-row" : ""} onTap={this.onClick.bind(this)}>
        <td>
          {this.props.drinkData.drink.title}
        </td>
        <td>
          <span>
            {this.props.drinkData.drink.price} {String.fromCharCode(8364)}
          </span>
        </td>
      </Tappable>
    )
  }
}
