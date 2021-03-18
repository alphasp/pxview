import { USER_BOOKMARK_ILLUSTS } from '../constants/actionTypes';

export default function userBookmarkIllusts(state = {}, action) {
  switch (action.type) {
    case USER_BOOKMARK_ILLUSTS.CLEAR:
      return {
        ...state,
        [action.payload.userId]: {
          loading: false,
          loaded: false,
          refreshing: false,
          items: [],
          nextUrl: null,
        },
      };
    case USER_BOOKMARK_ILLUSTS.CLEAR_ALL:
      return {};
    case USER_BOOKMARK_ILLUSTS.REQUEST:
      return {
        ...state,
        [action.payload.userId]: {
          ...state[action.payload.userId],
          loading: true,
          refreshing: action.payload.refreshing,
        },
      };
    case USER_BOOKMARK_ILLUSTS.SUCCESS:
      return {
        ...state,
        [action.payload.userId]: {
          ...state[action.payload.userId],
          loading: false,
          loaded: true,
          refreshing: false,
          items:
            state[action.payload.userId] && state[action.payload.userId].items
              ? [
                  ...new Set([
                    ...state[action.payload.userId].items,
                    ...action.payload.items,
                  ]),
                ]
              : action.payload.items,
          nextUrl: action.payload.nextUrl,
          timestamp: action.payload.timestamp,
        },
      };
    case USER_BOOKMARK_ILLUSTS.FAILURE:
      return {
        ...state,
        [action.payload.userId]: {
          ...state[action.payload.userId],
          loading: false,
          loaded: true,
          refreshing: false,
        },
      };
    default:
      return state;
  }
}
