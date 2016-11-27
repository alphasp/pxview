import { 
  REQUEST_USER_MANGAS, 
  RECEIVE_USER_MANGAS,
  STOP_USER_MANGAS, 
  CLEAR_USER_MANGAS,
  CLEAR_ALL_USER_MANGAS,
} from "../actions/userManga";

export default function userIllust(state = {}, action) {
  switch (action.type) {
    case CLEAR_USER_MANGAS:
      return {
        ...state,
        [action.payload.userId]: {},
      };
    case CLEAR_ALL_USER_MANGAS:
      return {};  
    case REQUEST_USER_MANGAS:
      return {
        ...state,
        [action.payload.userId]: {
          ...state[action.payload.userId],
          loading: true
        }
      };
    case RECEIVE_USER_MANGAS:
      return {
        ...state,
        [action.payload.userId]: {
          ...state[action.payload.userId],
          loading: false,
          loaded: true,
          items: (state[action.payload.userId] && state[action.payload.userId].items) ? [...state[action.payload.userId].items, ...action.payload.items] : action.payload.items,
          offset: action.payload.offset,
          nextUrl: action.payload.nextUrl,
          lastUpdated: action.payload.receivedAt
        }
      };
    case STOP_USER_MANGAS:
      return {
        ...state,
        [action.payload.userId]: {
          ...state[action.payload.userId],
          loading: false
        }
      };
    default:
      return state;
  }
}