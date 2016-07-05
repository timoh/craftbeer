import React from 'react';
import {Link} from 'react-router';

export default class SearchButton extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    let content;
    const noOfStoresWithSelectedDrinks = this.props.noOfStoresWithSelectedDrinks;
    const noOfSelectedDrinks = this.props.noOfSelectedDrinks;
    if (noOfSelectedDrinks === 0) {
      content = (
        <div className="h4 centered">
           Select drinks first.
        </div>
      )
    } else {
      if (noOfStoresWithSelectedDrinks === 0) {
        content= (
          <div className="h4 centered">
             Found no Alko stores with all selected drinks in stock.
          </div>
        )
      } else {
        let storesText = "";
        if (noOfStoresWithSelectedDrinks == 1) {
          storesText = "store";
        } else {
          storesText = "stores";
        }
        content = (
          <div>
              <Link to="/storespage" className="btn btn-primary btn-lg search-button">Show {noOfStoresWithSelectedDrinks} Alko {storesText}</Link>
          </div>
        )
      }
    }

    return (
      <div>
        {content}
      </div>
    )
  }
}
