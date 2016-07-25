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
    const noOfVisibleDrinks = this.props.noOfVisibleDrinks;
    if (noOfSelectedDrinks === 0) {
      if (noOfVisibleDrinks === 0) {
        content = (
          <div className="alert alert-warning alert-custom">
             No stores found. Try increasing the distance to get some results.
          </div>
        )
      } else {
        content = (
          <div className="alert alert-info alert-custom">
             Select drinks to see how many nearby stores have all the selected drinks.
          </div>
        )
      }
    } else {
      if (noOfStoresWithSelectedDrinks === 0) {
        content= (
          <div className="alert alert-info alert-custom">
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
