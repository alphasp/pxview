import { USER_MANGAS } from '../constants/actionTypes';

export default function userMangas(state = {}, action) {
  switch (action.type) {
    case USER_MANGAS.CLEAR:
      return {
        ...state,
        [action.payload.userId]: {},
      };
    case USER_MANGAS.CLEAR_ALL:
      return {};
    case USER_MANGAS.REQUEST:
      return {
        ...state,
        [action.payload.userId]: {
          ...state[action.payload.userId],
          loading: true,
          refreshing: action.payload.refreshing,
        },
      };
    case USER_MANGAS.SUCCESS:
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
    case USER_MANGAS.FAILURE:
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
