import { SEARCH_USERS } from '../constants/actionTypes';

const initState = {
  loading: false,
  loaded: false,
  refreshing: false,
  items: [],
  offset: 0,
  nextUrl: null,
};

export default function searchUsers(state = initState, action) {
  switch (action.type) {
    case SEARCH_USERS.CLEAR:
      return {
        ...state,
        [action.payload.navigationStateKey]: initState,
      };
    case SEARCH_USERS.CLEAR_ALL:
      return {};
    case SEARCH_USERS.REQUEST:
      return {
        ...state,
        [action.payload.navigationStateKey]: {
          ...state[action.payload.navigationStateKey],
          loading: true,
          refreshing: action.payload.refreshing,
          word: action.payload.word,
          offset: action.payload.offset,
        },
      };
    case SEARCH_USERS.SUCCESS:
      return {
        ...state,
        [action.payload.navigationStateKey]: {
          ...state[action.payload.navigationStateKey],
          loading: false,
          loaded: true,
          refreshing: false,
          items: state[action.payload.navigationStateKey] &&
            state[action.payload.navigationStateKey].items
            ? [
                ...state[action.payload.navigationStateKey].items,
                ...action.payload.items,
              ]
            : action.payload.items,
          nextUrl: action.payload.nextUrl,
          timestamp: action.payload.timestamp,
        },
      };
    case SEARCH_USERS.FAILURE:
      return {
        ...state,
        [action.payload.navigationStateKey]: {
          ...state[action.payload.navigationStateKey],
          loading: false,
          loaded: true,
          refreshing: false,
        },
      };
    default:
      return state;
  }
}
