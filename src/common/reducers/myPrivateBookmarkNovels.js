import { MY_PRIVATE_BOOKMARK_NOVELS } from '../constants/actionTypes';

const initState = {
  loading: false,
  loaded: false,
  refreshing: false,
  items: [],
  offset: null,
  nextUrl: null,
};

export default function myPrivateBookmarkNovels(state = initState, action) {
  switch (action.type) {
    case MY_PRIVATE_BOOKMARK_NOVELS.CLEAR:
      return initState;
    case MY_PRIVATE_BOOKMARK_NOVELS.REQUEST:
      return {
        ...state,
        loading: true,
        refreshing: action.payload.refreshing,
      };
    case MY_PRIVATE_BOOKMARK_NOVELS.SUCCESS:
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
    case MY_PRIVATE_BOOKMARK_NOVELS.FAILURE:
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
