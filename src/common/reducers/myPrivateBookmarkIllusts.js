import { MY_PRIVATE_BOOKMARK_ILLUSTS } from '../constants/actionTypes';

const defaultState = {
  loading: false,
  loaded: false,
  refreshing: false,
  items: [],
  offset: null,
  nextUrl: null,
};

export default function userIllust(state = defaultState, action) {
  switch (action.type) {
    case MY_PRIVATE_BOOKMARK_ILLUSTS.CLEAR:
      return defaultState;
    case MY_PRIVATE_BOOKMARK_ILLUSTS.REQUEST:
      return {
        ...state,
        loading: true,
        refreshing: action.payload.refreshing,
      };
    case MY_PRIVATE_BOOKMARK_ILLUSTS.SUCCESS:
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
    case MY_PRIVATE_BOOKMARK_ILLUSTS.FAILURE:
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
