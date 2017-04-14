import { SEARCH_USERS } from '../constants/actionTypes';

const defaultState = {
  loading: false,
  loaded: false,
  refreshing: false,
  items: [],
  offset: 0,
  nextUrl: null,
};

export default function searchUsers(state = defaultState, action) {
  switch (action.type) {
    case SEARCH_USERS.CLEAR:
      return defaultState;
    case SEARCH_USERS.REQUEST:
      return {
        ...state,
        loading: true,
        refreshing: action.payload.refreshing
      };
    case SEARCH_USERS.SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        refreshing: false,
        items: [...state.items, ...action.payload.items],
        nextUrl: action.payload.nextUrl,
        timestamp: action.payload.timestamp,
      };
    case SEARCH_USERS.FAILURE:
      return {
        ...state,
        loading: false,
        refreshing: false
      };
    default:
      return state;
  }
}