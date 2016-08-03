import React from 'react';
import {Link} from 'react-router';

export default class DrinkTableRow extends React.Component {

  constructor(props) {
    super(props);
  }

  calculateTopNearestStores(availabilityCondition) {
    const avails = [];

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

  handleChecked(e) {
    e.stopPropagation();
    this.props.handleChecked(this.props.drinkData);
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
        <div className="div-table-row">
            <div className="div-table-col centered">
              <input type="checkbox" id={this.props.drinkData.drink._id.$oid} className="chk-btn" checked={this.props.drinkData.selected} onChange={this.handleChecked.bind(this)} />
                  <label htmlFor={this.props.drinkData.drink._id.$oid}></label>
            </div>
            <div className="div-table-col">
              <Link to={`/alco_drinks/${this.props.drinkData.drink._id.$oid}`}>{this.props.drinkData.drink.title}</Link>
            </div>

            <div className="div-table-col">
              {this.props.drinkData.review_score}
            </div>
            <div className="div-table-col">
              {this.props.drinkData.drink.size.toFixed(2)}
            </div>
            <div className="div-table-col">
              {this.props.drinkData.drink.price.toFixed(2)} {String.fromCharCode(8364)}
            </div>
            <div className="div-table-col">
              {this.props.drinkData.maxAvailability}
            </div>
            <div className="div-table-col">
            {this.props.drinkData.noOfNearbyStoresWithAvailability}
            </div>
            <div className="div-table-col topstores">
              {topThreeStoresContent}
            </div>
        </div>
    )
  }
}

/*
MikkoR: removed these on 5.7.2016
<td>
  {this.props.drinkData.review_title}
</td>
<td>
  {this.props.drinkData.drink.best_rev_candidate_score.toFixed(2)}
</td>

*/
