import { USER_BOOKMARK_NOVELS } from '../constants/actionTypes';

export default function userBookmarkNovels(state = {}, action) {
  switch (action.type) {
    case USER_BOOKMARK_NOVELS.CLEAR:
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
    case USER_BOOKMARK_NOVELS.CLEAR_ALL:
      return {};
    case USER_BOOKMARK_NOVELS.REQUEST:
      return {
        ...state,
        [action.payload.userId]: {
          ...state[action.payload.userId],
          loading: true,
          refreshing: action.payload.refreshing,
        },
      };
    case USER_BOOKMARK_NOVELS.SUCCESS:
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
    case USER_BOOKMARK_NOVELS.FAILURE:
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
