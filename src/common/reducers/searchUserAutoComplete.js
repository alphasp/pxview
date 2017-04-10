import { 
  REQUEST_SEARCH_USER_AUTOCOMPLETE, 
  RECEIVE_SEARCH_USER_AUTOCOMPLETE,
  RECEIVE_SEARCH_USER_AUTOCOMPLETE_CONCAT,
  STOP_SEARCH_USER_AUTOCOMPLETE, 
  CLEAR_SEARCH_USER_AUTOCOMPLETE,
} from "../actions/searchUserAutoComplete";

export default function searchUser(state = {
  loading: false,
  loaded: false,
  items: [],
  nextUrl: null,
}, action) {
  switch (action.type) {
    case CLEAR_SEARCH_USER_AUTOCOMPLETE:
      return {
        ...state,
        loading: false,
        loaded: false,
        items: [],
        nextUrl: null,
      };
    case REQUEST_SEARCH_USER_AUTOCOMPLETE:
      return {
        ...state,
        loading: true,
      };
    case RECEIVE_SEARCH_USER_AUTOCOMPLETE:
      return {
        ...state,
        loading: false,
        loaded: true,
        items: [...action.payload.items],
        nextUrl: action.payload.nextUrl,
        timestamp: action.payload.timestamp,
      };
    case RECEIVE_SEARCH_USER_AUTOCOMPLETE_CONCAT:
      return {
        ...state,
        loading: false,
        loaded: true,
        items: [...state.items, ...action.payload.items],
        nextUrl: action.payload.nextUrl,
        timestamp: action.payload.timestamp,
      };
    case STOP_SEARCH_USER_AUTOCOMPLETE:
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
}