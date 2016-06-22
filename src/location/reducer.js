export function reducer(state = {
  position: [0.00, 0.00],
  loading: false,
  requested: false
}, action) {
  switch (action.type) {
    case 'REQUEST_LOCATION': {
      return {
        ...state,
        loading: true,
        requested: true
      };
    }
    case 'RECEIVE_LOCATION':
      return {
        ...state,
        position: action.position,
        loading: false
      };
    default:
      return state;
  }
}
