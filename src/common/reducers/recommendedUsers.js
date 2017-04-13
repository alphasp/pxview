import { RECOMMENDED_USERS } from '../constants/actionTypes';

const defaultState = {
  loading: false,
  loaded: false,
  refreshing: false,
  items: [],
  offset: 0,
  nextUrl: null,
};

export function recommendedUsers(state = defaultState, action) {
  switch (action.type) {
    case RECOMMENDED_USERS.CLEAR:
      return defaultState;
    case RECOMMENDED_USERS.REQUEST:
      return {
        ...state,
        loading: true,
        refreshing: action.payload.refreshing
      };
    case RECOMMENDED_USERS.SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        refreshing: false,
        items: [...state.items, ...action.payload.items],
        offset: action.payload.offset,
        nextUrl: action.payload.nextUrl,
        timestamp: action.payload.timestamp,
      };
    case RECOMMENDED_USERS.FAILURE:
      return {
        ...state,
        loading: false,
        refreshing: false
      };
    default:
      return state;
  }
}