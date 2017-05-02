import { USER_ILLUSTS } from '../constants/actionTypes';

export default function userIllusts(state = {}, action) {
  switch (action.type) {
    case USER_ILLUSTS.CLEAR:
      return {
        ...state,
        [action.payload.userId]: {},
      };
    case USER_ILLUSTS.CLEAR_ALL:
      return {};
    case USER_ILLUSTS.REQUEST:
      return {
        ...state,
        [action.payload.userId]: {
          ...state[action.payload.userId],
          loading: true,
          refreshing: action.payload.refreshing,
        },
      };
    case USER_ILLUSTS.SUCCESS:
      return {
        ...state,
        [action.payload.userId]: {
          ...state[action.payload.userId],
          loading: false,
          loaded: true,
          refreshing: false,
          items: (state[action.payload.userId] && state[action.payload.userId].items) ? [...state[action.payload.userId].items, ...action.payload.items] : action.payload.items,
          offset: action.payload.offset,
          nextUrl: action.payload.nextUrl,
          timestamp: action.payload.timestamp,
        },
      };
    case USER_ILLUSTS.FAILURE:
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
