import { MY_PIXIV_NOVELS } from '../constants/actionTypes';

const initState = {
  loading: false,
  loaded: false,
  refreshing: false,
  items: [],
  offset: null,
  nextUrl: null,
};

export default function myPixivNovels(state = initState, action) {
  switch (action.type) {
    case MY_PIXIV_NOVELS.CLEAR:
      return initState;
    case MY_PIXIV_NOVELS.REQUEST:
      return {
        ...state,
        loading: true,
        refreshing: action.payload.refreshing,
      };
    case MY_PIXIV_NOVELS.SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        refreshing: false,
        items: [...new Set([...state.items, ...action.payload.items])],
        offset: action.payload.offset,
        nextUrl: action.payload.nextUrl,
        timestamp: action.payload.timestamp,
      };
    case MY_PIXIV_NOVELS.FAILURE:
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
