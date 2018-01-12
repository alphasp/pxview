import { FOLLOWING_USER_NOVELS } from '../constants/actionTypes';

const initState = {
  loading: false,
  loaded: false,
  refreshing: false,
  items: [],
  options: null,
  offset: 0,
  nextUrl: null,
};

export default function followingUserNovels(state = initState, action) {
  switch (action.type) {
    case FOLLOWING_USER_NOVELS.CLEAR:
      return initState;
    case FOLLOWING_USER_NOVELS.REQUEST:
      return {
        ...state,
        loading: true,
        options: action.payload.options,
        refreshing: action.payload.refreshing,
      };
    case FOLLOWING_USER_NOVELS.SUCCESS:
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
    case FOLLOWING_USER_NOVELS.FAILURE:
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
