export function reducer(state = {
  position: [0.00, 0.00],
  loading: false,
  requested: false,
  address: '',
  shouldUpdateDrinks: false
}, action) {
  switch (action.type) {
    case 'REQUEST_LOCATION':
      return {
        ...state,
        loading: true,
        requested: true
      };
    case 'RECEIVE_LOCATION':
      // drinks data should be updated only if location has changed.
      const shouldUpdateDrinks = state.position[0].toFixed(2) != action.position[0].toFixed(2) || state.position[1].toFixed(2) != action.position[1].toFixed(2);
      return {
        ...state,
        position: action.position,
        loading: action.loading,
        shouldUpdateDrinks: shouldUpdateDrinks
      };
    case 'RECEIVE_ADDRESS':
      return {
        ...state,
        address: action.address,
        loading: false
      }
    case 'INPUT_ADDRESS':
      return {
        ...state,
        address: action.address
      }
    case 'DRINKS_UPDATED':
      return {
        ...state,
        shouldUpdateDrinks: false
      }
    default:
      return state;
  }
}
