import { 
  REQUEST_LOGIN, SUCCESS_LOGIN, FAILED_LOGIN, LOGOUT
} from '../actions/auth';

export default function auth(state = {
  loading: false,
  loaded: false,
  user: null,
}, action) {
  switch (action.type) {
    case LOGOUT:
      return {
        ...state,
        user: null,
        loaded: false
      }
    case REQUEST_LOGIN:
      return {
        ...state,
        loading: true
      };
    case SUCCESS_LOGIN:
      return {
        ...state,
        loading: false,
        loaded: true,
        user: action.payload.user,
        lastUpdated: action.payload.receivedAt,
      };
    case FAILED_LOGIN:
      return {
        ...state,
        loading: false
      };
    default:
      return state;
  }
}