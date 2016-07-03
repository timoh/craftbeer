//this file should contain the actions that are used in different software modules

export function selectDrinkFromSelected(selected) {
  return {
    type: 'SELECT_DRINK_FROM_SELECTED',
    selectedDrink: selected
  };
}

export function drinksUpdated() {
  return {
    type: 'DRINKS_UPDATED'
  };
}
