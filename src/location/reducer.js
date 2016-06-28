export function reducer(state = {
  position: [0.00, 0.00],
  loading: false,
  requested: false,
  address: ''
}, action) {
  switch (action.type) {
    case 'REQUEST_LOCATION':
      return {
        ...state,
        loading: true,
        requested: true
      };
    case 'RECEIVE_LOCATION':
      return {
        ...state,
        position: action.position
      };
    case 'RECEIVE_ADDRESS':
      return {
        ...state,
        address: action.address,
        loading: false
      }
    default:
      return state;
  }
}
