import React from 'react';
import {Link} from 'react-router';

export default class SelectedDrink extends React.Component {

  constructor(props) {
    super(props);
  }

  getAvailabilities() {
    const availsArr = [];
    const storeIDs = Object.keys(this.props.storesData);
    this.props.drinkData.nearbyStoresWithAvailability.map((nearbyStore) =>
      {
        // if the store that matches the distance condition is one of the stores with all selected drinks, then add it to the result array.
        if(storeIDs.indexOf(nearbyStore.store._id.$oid) != -1) {
          availsArr.push({
            storeName: nearbyStore.store.loc_name,
            amount: nearbyStore.avail.amount,
            distance_in_m: nearbyStore.distance_in_m,
            address: nearbyStore.store.address,
            url: 'http://www.alko.fi' + nearbyStore.store.store_link
            });
        }
      }
    );
    availsArr.sort((a,b) => {
      return a.distance_in_m - b.distance_in_m;
    });
    return availsArr;
  }

  render() {
    let img;
    if (this.props.drinkData !== undefined && this.props.drinkData.drink !== undefined) {
      img = (
          <img src={`/pics/productpic_${this.props.drinkData.drink.alko_id}.png`} className="img-responsive img-very-small"/>
      );
    }
    let avails;
    if (this.props.drinkData !== undefined && this.props.drinkData.drink !== undefined && this.props.storesData !== undefined){
      avails = this.getAvailabilities();
    }
    let content;
    if (this.props.drinkData !== undefined && this.props.drinkData.drink !== undefined) {
      content = (
        <div>
          <div className="row no-margin-left-right">
            <div className="col-md-offset-2">
                <div className="thumbnail">
                  {img}
                   <div className="caption-full">
                       <h4 className="pull-right">{this.props.drinkData.drink.price} {String.fromCharCode(8364)}</h4>
                       <h4>{this.props.drinkData.drink.title}</h4>
                   </div>
                </div>
            </div>
          </div>
          <div className="row no-margin-left-right">
            <div className="col-md-offset-2">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Size
                    </th>
                    <th>Type
                    </th>
                    <th>Product page on Alko's site
                    </th>
                    <th>Product page
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      {this.props.drinkData.drink.size} l
                    </td>
                    <td>
                      {this.props.drinkData.drink.type ? this.props.drinkData.drink.type.capitalize() : ''}
                    </td>
                    <td>
                      <a href={this.props.drinkData.drink.url}>
                        Show product on Alko website</a>
                    </td>
                    <td>
                      <Link to={`/alco_drinks/${this.props.drinkData.drink._id.$oid}`}>{this.props.drinkData.drink.title}</Link>
                    </td>
                  </tr>
                </tbody>
              </table>
              <h4>Availability:</h4>
              <table className="table table-striped">
              <thead>
                <tr>
                  <th>Store
                  </th>
                  <th>Amount in pcs
                  </th>
                  <th>
                    Address (distance from current location)
                  </th>
                </tr>
              </thead>
              <tbody>
              { avails.map((avail) => {
                return (
                  <tr key={avail.storeName}>
                    <td>
                      <a href={avail.url}>{avail.storeName}</a>
                    </td>
                    <td>
                      {avail.amount}
                    </td>
                    <td>
                      {avail.address} ({(avail.distance_in_m/1000).toFixed(2)} km)
                    </td>
                  </tr>
                  );
              })}
              </tbody>
              </table>
            </div>
          </div>
        </div>
      )
    } else {
      content = (
        <div className="row">
        </div>
      )
    }
    return (
      <div>
        {content}
      </div>
    )
  }
}
