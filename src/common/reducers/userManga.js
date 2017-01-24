import { 
  REQUEST_USER_MANGAS, 
  RECEIVE_USER_MANGAS,
  STOP_USER_MANGAS, 
  CLEAR_USER_MANGAS,
  CLEAR_ALL_USER_MANGAS,
} from "../actions/userManga";
import { 
  BOOKMARK_ILLUST, 
  UNBOOKMARK_ILLUST,
} from "../actions/bookmarkIllust";

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
    case BOOKMARK_ILLUST:
      return state[action.payload.userId] ? 
        {
          ...state,
          [action.payload.userId]: {
            ...state[action.payload.userId],
            items: state[action.payload.userId].items.map(item =>
              item.id === action.payload.illustId ?
              { ...item, is_bookmarked: true } 
              :
              item
            )
          }
        }
        :
        state;
    case UNBOOKMARK_ILLUST:
      return state[action.payload.userId] ? 
        {
          ...state,
          [action.payload.userId]: {
            ...state[action.payload.userId],
            items: state[action.payload.userId].items.map(item =>
              item.id === action.payload.illustId ?
              { ...item, is_bookmarked: false } 
              :
              item
            )
          }
        }
        :
        state;
    default:
      return state;
  }
}