import { 
  REQUEST_USER_DETAIL, 
  RECEIVE_USER_DETAIL, 
  STOP_USER_DETAIL, 
  CLEAR_USER_DETAIL, 
  CLEAR_ALL_USER_DETAIL
} from "../actions/userDetail";

export default function userDetail(state = {}, action) {
  switch (action.type) {
    case CLEAR_USER_DETAIL:
      return {
        ...state,
        [action.payload.userId]: {},
      };
    case CLEAR_ALL_USER_DETAIL:
      return {};  
    case REQUEST_USER_DETAIL:
      return {
        ...state,
        [action.payload.userId]: {
          ...state[action.payload.userId],
          loading: true
        }
      };
    case RECEIVE_USER_DETAIL:
      return {
        ...state,
        [action.payload.userId]: {
          ...state[action.payload.userId],
          loading: false,
          loaded: true,
          item: action.payload.item,
          timestamp: action.payload.timestamp
        }
      };
    case STOP_USER_DETAIL:
      return {
        ...state,
        [action.payload.userId]: {
          ...state[action.payload.userId],
          loading: false
        }
      };
    default:
      return state;
  }
}