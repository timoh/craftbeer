import React from 'react';
import {Link} from 'react-router';

export default class DrinkTableRow extends React.Component {

  constructor(props) {
    super(props);
  }


  calculateTopNearestStores(availabilityCondition) {
    var avails = [];

    if(this.props.drinkData.avails !== undefined) {
      this.props.drinkData.avails.map(function(availData) {
        if(availabilityCondition) {
          if(availData.matchesDistanceCondition && availData.avail.amount > 0) {
            avails.push(availData);
          }
        } else {
          if(availData.matchesDistanceCondition) {
            avails.push(availData);
          }
        }
      });
    }
    avails.sort(function(a,b) {
      return a.distance_in_m - b.distance_in_m;
    });

    const size = avails.length;
    if (size == 2) {
      return avails.slice(0,2);
    } else if (size >= 3) {
      return avails.slice(0,3);
    } else {
      return avails;
    }
  }

  topNearestStores(availabilityCondition) {
    var storesString = "";
    var stores = this.calculateTopNearestStores(availabilityCondition);
    if(stores.length>0) {
      stores.map(function(storeInArray) {
          storesString += "Name: " + storeInArray.store.loc_name + "\n";
          storesString += "Address: " + storeInArray.store.address + "\n";
          storesString += "Distance: " + (storeInArray.distance_in_m/1000).toFixed(2) +" km\n";
          storesString += "Amount: " + storeInArray.avail.amount + " pcs\n\n";
      });
    } else {
      storesString ="No stores match the filters.";
    }
    return storesString;
  }

  handleChecked() {
      this.props.handleChecked(this);
  }

  render() {
    const storesWithAvailability = this.topNearestStores(true);
    const nearbyStores = this.topNearestStores(false);
    return(
        <tr>
            <td className="centered">
                <input type="checkbox" className="custom-checkbox" checked={this.props.drinkData.selected} onChange={this.handleChecked.bind(this)} />
            </td>
            <td>
              <Link to={`/alco_drinks/${this.props.drinkData.drink._id.$oid}`}>{this.props.drinkData.drink.title}</Link>
            </td>
            <td>
              {this.props.drinkData.drink.title}
            </td>
            <td>
              {this.props.drinkData.drink.best_rev_candidate_score.toFixed(2)}
            </td>
            <td>
              {this.props.drinkData.score}
            </td>
            <td>
              {this.props.drinkData.drink.size.toFixed(2)}
            </td>
            <td>
              {this.props.drinkData.drink.price.toFixed(2)}
            </td>
            <td>
              {this.props.drinkData.maxAvailability}
            </td>
            <td>
              <div className="tableCell">
                <a href="#">{this.props.drinkData.noOfNearbyStoresWithAvailability} </a>
                    <div className="popup">{storesWithAvailability}</div>
              </div>
            </td>
            <td>
            <div className="tableCell">
              <a href="#">{this.props.drinkData.noOfStoresMatchingDistanceCondition} </a>
                  <div className="popup">{nearbyStores}</div>
            </div>
            </td>
        </tr>
    )
  }
}
