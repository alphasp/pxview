import { 
  REQUEST_USER_ILLUSTS, 
  RECEIVE_USER_ILLUSTS,
  STOP_USER_ILLUSTS, 
  CLEAR_USER_ILLUSTS,
  CLEAR_ALL_USER_ILLUSTS,
} from "../actions/userIllust";
import { 
  BOOKMARK_ILLUST, 
  UNBOOKMARK_ILLUST,
} from "../actions/bookmarkIllust";

export default function userIllust(state = {}, action) {
  switch (action.type) {
    case CLEAR_USER_ILLUSTS:
      return {
        ...state,
        [action.payload.userId]: {},
      };
    case CLEAR_ALL_USER_ILLUSTS:
      return {};  
    case REQUEST_USER_ILLUSTS:
      return {
        ...state,
        [action.payload.userId]: {
          ...state[action.payload.userId],
          loading: true
        }
      };
    case RECEIVE_USER_ILLUSTS:
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
    case STOP_USER_ILLUSTS:
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