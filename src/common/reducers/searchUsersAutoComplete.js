import { SEARCH_USERS_AUTOCOMPLETE } from '../constants/actionTypes';

const initState = {
  loading: false,
  loaded: false,
  refreshing: false,
  items: [],
  word: null,
  offset: 0,
  nextUrl: null,
};

export default function searchUsersAutoComplete(state = initState, action) {
  switch (action.type) {
    case SEARCH_USERS_AUTOCOMPLETE.CLEAR:
      return initState;
    case SEARCH_USERS_AUTOCOMPLETE.REQUEST:
      return {
        ...state,
        loading: true,
        refreshing: action.payload.refreshing,
        word: action.payload.word,
        offset: action.payload.offset,
      };
    case SEARCH_USERS_AUTOCOMPLETE.SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        refreshing: false,
        items: [...new Set([...state.items, ...action.payload.items])],
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
