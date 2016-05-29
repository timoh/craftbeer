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

  handleChecked() {
      this.props.handleChecked(this);
  }

  render() {

    const topThreeStores = this.calculateTopNearestStores(true);
    let topThreeStoresContent;
    if (topThreeStores.length === 0) {
      topThreeStoresContent = (
        <span>
           No stores match the filters.
        </span>
      )
    } else {
      topThreeStoresContent = topThreeStores.map(function(storeInArray){
        const address ="http://www.alko.fi" + storeInArray.store.store_link;
        return (
          <div key={storeInArray.store._id.$oid}>
            <a href={address}>{storeInArray.store.loc_name} ({(storeInArray.distance_in_m/1000).toFixed(2)} km, {storeInArray.avail.amount} pcs)</a>
            <br/>
          </div>
        )
      });
    }
    return(
        <tr>
            <td className="centered">
                <input type="checkbox" className="custom-checkbox" checked={this.props.drinkData.selected} onChange={this.handleChecked.bind(this)} />
            </td>
            <td>
              <Link to={`/alco_drinks/${this.props.drinkData.drink._id.$oid}`}>{this.props.drinkData.drink.title}</Link>
            </td>
            <td>
              {this.props.drinkData.reviewTitle}
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
            {this.props.drinkData.noOfNearbyStoresWithAvailability}
            </td>
            <td className="topstores">
              {topThreeStoresContent}
            </td>
        </tr>
    )
  }
}
