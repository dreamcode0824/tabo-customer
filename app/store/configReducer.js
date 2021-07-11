import {log} from 'react-native-reanimated';

const config = {
  country: {},
  language: 'en',
};

const configReducer = (state = config, action) => {
  console.log(action);
  switch (action.type) {
    case 'SET_COUNTRY':
      return {
        ...state,
        ...action.value,
      };
    case 'SET_LANGUAGE':
      return {
        ...state,
        language: action.value,
      };
    case 'SET_DATES':
      return {
        ...state,
        [action.value.type]: {
          ...state[action.value.type],
          ...action.value.data,
        },
      };
    case 'SET_URL_REDIRECTION':
      return {
        ...state,
        urlRedirection: true,
        urlRedirectionId: action.value,
      };
    case 'REMOVE_URL_REDIRECTION':
      return {
        ...state,
        urlRedirection: false,
        urlRedirectionId: null,
      };
    default:
      break;
  }
  return state;
};
export default configReducer;
