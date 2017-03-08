import { 
  REQUEST_RECOMMENDED_USERS, 
  RECEIVE_RECOMMENDED_USERS,
  STOP_RECOMMENDED_USERS, 
  CLEAR_RECOMMENDED_USERS,
} from "../actions/recommendedUser";

export function recommendedUser(state = {
  loading: false,
  loaded: false,
  items: [],
  offset: 0,
  nextUrl: null,
}, action) {
  switch (action.type) {
    case CLEAR_RECOMMENDED_USERS:
      return {
        ...state,
        loading: false,
        loaded: false,
        items: [],
        offset: 0,
        nextUrl: null,
      };
    case REQUEST_RECOMMENDED_USERS:
      return {
        ...state,
        loading: true,
      };
    case RECEIVE_RECOMMENDED_USERS:
      return {
        ...state,
        loading: false,
        loaded: true,
        items: [...state.items, ...action.payload.items],
        offset: action.payload.offset,
        nextUrl: action.payload.nextUrl,
        lastUpdated: action.payload.receivedAt,
      };
    case STOP_RECOMMENDED_USERS:
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
}