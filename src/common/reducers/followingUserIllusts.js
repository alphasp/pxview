import { FOLLOWING_USER_ILLUSTS } from '../constants/actionTypes';

const defaultState = {
  loading: false,
  loaded: false,
  refreshing: false,
  items: [],
  offset: 0,
  nextUrl: null,
};

export default function followingUserIllusts(state = defaultState, action) {
  switch (action.type) {
    case FOLLOWING_USER_ILLUSTS.CLEAR:
      return defaultState;
    case FOLLOWING_USER_ILLUSTS.REQUEST:
      return {
        ...state,
        loading: true,
        refreshing: action.payload.refreshing,
      };
    case FOLLOWING_USER_ILLUSTS.SUCCESS:
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
    case FOLLOWING_USER_ILLUSTS.FAILURE:
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
