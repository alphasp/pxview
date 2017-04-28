import { USER_FOLLOWERS } from '../constants/actionTypes';

export default function userFollowers(state = {}, action) {
  switch (action.type) {
    case USER_FOLLOWERS.CLEAR:
      return {
        ...state,
        [action.payload.userId]: {},
      };
    case USER_FOLLOWERS.CLEAR_ALL:
      return {};
    case USER_FOLLOWERS.REQUEST:
      return {
        ...state,
        [action.payload.userId]: {
          ...state[action.payload.userId],
          loading: true,
          refreshing: action.payload.refreshing
        }
      };
    case USER_FOLLOWERS.SUCCESS:
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
    case USER_FOLLOWERS.FAILURE:
      return {
        ...state,
        [action.payload.userId]: {
          loading: false,
          loaded: true,
          refreshing: true
        }
      };
    default:
      return state;
  }
}