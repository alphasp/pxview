import { USER_NOVELS } from '../constants/actionTypes';

export default function userNovels(state = {}, action) {
  switch (action.type) {
    case USER_NOVELS.CLEAR:
      return {
        ...state,
        [action.payload.userId]: {},
      };
    case USER_NOVELS.CLEAR_ALL:
      return {};
    case USER_NOVELS.REQUEST:
      return {
        ...state,
        [action.payload.userId]: {
          ...state[action.payload.userId],
          loading: true,
          refreshing: action.payload.refreshing,
        },
      };
    case USER_NOVELS.SUCCESS:
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
          offset: action.payload.offset,
          nextUrl: action.payload.nextUrl,
          timestamp: action.payload.timestamp,
        },
      };
    case USER_NOVELS.FAILURE:
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
