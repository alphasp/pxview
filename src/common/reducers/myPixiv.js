import { MY_PIXIV } from '../constants/actionTypes';

const defaultState = {
  loading: false,
  loaded: false,
  refreshing: false,
  items: [],
  offset: null,
  nextUrl: null,
};

export default function myPixiv(state = defaultState, action) {
  switch (action.type) {
    case MY_PIXIV.CLEAR:
      return defaultState;
    case MY_PIXIV.REQUEST:
      return {
        ...state,
        loading: true,
        refreshing: action.payload.refreshing
      };
    case MY_PIXIV.SUCCESS:
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
    case MY_PIXIV.FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        refreshing: false
      };
    default:
      return state;
  }
}