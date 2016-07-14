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
          <div className="col-md-4">
            <h3>Selected drinks
            </h3>
            {selectedDrinks}
          </div>
          <div className="col-md-8">
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
