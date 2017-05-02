import { SEARCH_AUTOCOMPLETE } from '../constants/actionTypes';

const defaultState = {
  loading: false,
  loaded: false,
  items: [],
};

export default function searchAutoComplete(state = defaultState, action) {
  switch (action.type) {
    case SEARCH_AUTOCOMPLETE.CLEAR:
      return defaultState;
    case SEARCH_AUTOCOMPLETE.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case SEARCH_AUTOCOMPLETE.SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        items: [...action.payload.items],
        timestamp: action.payload.timestamp,
      };
    case SEARCH_AUTOCOMPLETE.FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
      };
    default:
      return state;
  }
}
