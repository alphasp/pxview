import { 
  REQUEST_SEARCH_USER, 
  RECEIVE_SEARCH_USER,
  RECEIVE_SEARCH_USER_CONCAT,
  STOP_SEARCH_USER, 
  CLEAR_SEARCH_USER,
} from "../actions/searchUser";

export default function searchUser(state = {
  loading: false,
  loaded: false,
  items: [],
  nextUrl: null,
}, action) {
  switch (action.type) {
    case CLEAR_SEARCH_USER:
      return {
        ...state,
        loading: false,
        loaded: false,
        items: [],
        nextUrl: null,
      };
    case REQUEST_SEARCH_USER:
      return {
        ...state,
        loading: true,
      };
    case RECEIVE_SEARCH_USER:
      return {
        ...state,
        loading: false,
        loaded: true,
        items: [...action.payload.items],
        nextUrl: action.payload.nextUrl,
        lastUpdated: action.payload.receivedAt,
      };
    case RECEIVE_SEARCH_USER_CONCAT:
      return {
        ...state,
        loading: false,
        loaded: true,
        items: [...state.items, ...action.payload.items],
        nextUrl: action.payload.nextUrl,
        lastUpdated: action.payload.receivedAt,
      };
    case STOP_SEARCH_USER:
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
}