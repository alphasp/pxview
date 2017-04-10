import { 
  REQUEST_SEARCH_AUTOCOMPLETE, 
  RECEIVE_SEARCH_AUTOCOMPLETE,
  STOP_SEARCH_AUTOCOMPLETE, 
  CLEAR_SEARCH_AUTOCOMPLETE,
} from "../actions/searchAutoComplete";

export function searchAutoComplete(state = {
  loading: false,
  loaded: false,
  items: [],
}, action) {
  switch (action.type) {
    case CLEAR_SEARCH_AUTOCOMPLETE:
      return {
        ...state,
        loading: false,
        loaded: false,
        items: [],
      };
    case REQUEST_SEARCH_AUTOCOMPLETE:
      return {
        ...state,
        loading: true,
      };
    case RECEIVE_SEARCH_AUTOCOMPLETE:
      return {
        ...state,
        loading: false,
        loaded: true,
        items: [...action.payload.items],
        timestamp: action.payload.timestamp,
      };
    case STOP_SEARCH_AUTOCOMPLETE:
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
}