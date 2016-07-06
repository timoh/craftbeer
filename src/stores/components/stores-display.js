import React from 'react';
import { connect } from 'react-redux';
import { getSelectedDrinks } from '../../shared/selectors';
import { selectDrinkFromSelected } from '../../shared/actions';
import SelectedDrink from './selected-drink';
import SelectedDrinkTableRow from './selected-drink-table-row';

class Stores extends React.Component {

  constructor(props) {
    super(props);
  }

  onDrinkClick(drinkData) {
    this.props.onDrinkClick(drinkData);
  }

  render() {
    const storesArray = Object.keys(this.props.stores).map((key) => {
      return this.props.stores[key];
    });
    storesArray.sort(function(a,b) {
      return a.distance_in_m - b.distance_in_m;
    });
    let selectedDrinks;
    if (this.props.drinks.length > 0) {
      selectedDrinks = (
        <table className="table table-hover selected-drinks-table-row">
          <tbody>
              { this.props.drinks.map((drinkData) => {
                const selected = this.props.selectedDrink.drink._id.$oid == drinkData.drink._id.$oid ? true : false;
                return (
                    <SelectedDrinkTableRow key={drinkData.drink._id.$oid} drinkData={drinkData} selected={selected} onClick={this.onDrinkClick.bind(this)}/>
                  );
              })}
          </tbody>
        </table>
      )
    } else {
      selectedDrinks = (
        <div className="alert alert-info">
          Select drinks first.
        </div>
      )
    }

    return (
      <div>
        <div className="row">
          <div className="col-md-12">
            <h3>Stores that have selected drinks
            </h3>
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
                  { storesArray.map((storeInArray) => {
                    const address ="http://www.alko.fi" + storeInArray.store.store_link;
                    return (
                      <tr key={storeInArray.store._id.$oid}>
                        <td>
                          <a href={address}>{storeInArray.store.loc_name}</a>
                        </td>
                        <td>
                          {storeInArray.store.address} ({(storeInArray.distance_in_m/1000).toFixed(2)} km)
                        </td>
                      </tr>
                      );
                  })}
              </tbody>
            </table>
          </div>
        </div>
        <div className="row">
          <div className="col-md-5">
            <h3>Selected drinks
            </h3>
            {selectedDrinks}
          </div>
          <div className="col-md-7">
            <SelectedDrink drinkData={this.props.selectedDrink} storesData={this.props.stores} />
          </div>
        </div>
      </div>
    )
  }
};


const mapDispatchToStoresProps = (dispatch) => (
  {
    onDrinkClick: (selected) => (
      dispatch(selectDrinkFromSelected(selected))
    )
  }
);

const mapStateToStoresProps = (state) => (
  {
    stores: state.drinksData.storesWithSelectedDrinks,
    drinks: getSelectedDrinks(state.drinksData.drinks),
    selectedDrink: state.drinksData.drinkWithProductInfoShown
  }
)

const StoresDisplay = connect(
  mapStateToStoresProps,
  mapDispatchToStoresProps
)(Stores);

export default StoresDisplay;
