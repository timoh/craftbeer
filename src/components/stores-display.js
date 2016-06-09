import React from 'react';
import {connect} from 'react-redux';
import {getSelectedDrinks} from '../redux/helpers';
import {Link} from 'react-router';

class Stores extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
          <h4>Selected drinks
          </h4>
            <table className="table table-striped table-bordered">
              <thead>
                <tr>
                  <th>
                    Drink title
                  </th>
                </tr>
              </thead>
              <tbody>
                  { this.props.drinks.map(function (drinkData) {
                    return (
                      <tr key={drinkData.drink._id.$oid}>
                        <td>
                        <Link to={`/alco_drinks/${drinkData.drink._id.$oid}`}>{drinkData.drink.title}</Link>
                        </td>
                      </tr>
                      );
                  }, this)}
              </tbody>
          </table>
          <br/>
          <h4>Stores that have selected drinks
          </h4>
          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                <th>
                  Store title
                </th>
                <th>
                  Store address (distance from current location)
                </th>
              </tr>
            </thead>
            <tbody>
                { Object.keys(this.props.stores).map(function (key) {
                  const storeInObj = this.props.stores[key];
                  const address ="http://www.alko.fi" + storeInObj.store.store_link;
                  return (
                    <tr key={key}>
                      <td>
                        <a href={address}>{storeInObj.store.loc_name}</a>
                      </td>
                      <td>
                        {storeInObj.store.address} ({(storeInObj.distance_in_m/1000).toFixed(2)} km)
                      </td>
                    </tr>
                    );
                }, this)}
            </tbody>
        </table>
      </div>
    )
  }
};


const mapDispatchToStoresProps = (dispatch) => (
  {
    dispatch: dispatch
  }
);

const mapStateToStoresProps = state => (
  {
    stores: state.drinksData.storesWithSelectedDrinks,
    drinks: getSelectedDrinks(state.drinksData.drinks)
  }
)

const StoresDisplay = connect(
  mapStateToStoresProps,
  mapDispatchToStoresProps
)(Stores);

export default StoresDisplay;
