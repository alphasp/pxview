import { USER_MY_PIXIV } from '../constants/actionTypes';

export default function userMyPixiv(state = {}, action) {
  switch (action.type) {
    case USER_MY_PIXIV.CLEAR:
      return {
        ...state,
        [action.payload.userId]: {},
      };
    case USER_MY_PIXIV.CLEAR_ALL:
      return {};
    case USER_MY_PIXIV.REQUEST:
      return {
        ...state,
        [action.payload.userId]: {
          ...state[action.payload.userId],
          loading: true,
          refreshing: action.payload.refreshing
        }
      };
    case USER_MY_PIXIV.SUCCESS:
      return {
        ...state,
        [action.payload.userId]: {
          loading: false,
          loaded: true,
          refreshing: false,
          items: (state[action.payload.userId] && state[action.payload.userId].items) ? [...state[action.payload.userId].items, ...action.payload.items] : action.payload.items,
          offset: action.payload.offset,
          nextUrl: action.payload.nextUrl,
          timestamp: action.payload.timestamp,
        }
      };
    case USER_MY_PIXIV.FAILURE:
      return {
        ...state,
        [action.payload.userId]: {
          ...state[action.payload.userId],
          loading: false,
          loaded: true,
          refreshing: true
        }
      };
    default:
      return state;
  }
}