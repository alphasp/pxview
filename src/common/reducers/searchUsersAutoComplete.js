import { SEARCH_USERS_AUTOCOMPLETE } from '../constants/actionTypes';

const defaultState = {
  loading: false,
  loaded: false,
  refreshing: false,
  items: [],
  offset: 0,
  nextUrl: null,
};

export default function searchUsersAutoComplete(state = defaultState, action) {
  switch (action.type) {
    case SEARCH_USERS_AUTOCOMPLETE.CLEAR:
      return defaultState;
    case SEARCH_USERS_AUTOCOMPLETE.REQUEST:
      return {
        ...state,
        loading: true,
        refreshing: action.payload.refreshing,
      };
    case SEARCH_USERS_AUTOCOMPLETE.SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        refreshing: false,
        items: [...state.items, ...action.payload.items],
        nextUrl: action.payload.nextUrl,
        timestamp: action.payload.timestamp,
      };
    case SEARCH_USERS_AUTOCOMPLETE.FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        refreshing: false,
      };
    default:
      return state;
  }
}
