const user = {};

const userReducer = (state = user, action) => {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        ...action.value,
        loggedIn: true,
      };
    case 'SET_USER_LOGGED_IN':
      return {
        ...state,
        loggedIn: true,
      };
    case 'SET_USER_LOGGED_OUT':
      return {
        ...state,
        loggedIn: false,
      };
    default:
      break;
  }
  return state;
};
export default userReducer;
