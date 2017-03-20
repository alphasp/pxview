import { 
  REQUEST_USER_BOOKMARK_ILLUSTS, 
  RECEIVE_USER_BOOKMARK_ILLUSTS,
  STOP_USER_BOOKMARK_ILLUSTS, 
  CLEAR_USER_BOOKMARK_ILLUSTS,
  CLEAR_ALL_USER_BOOKMARK_ILLUSTS,
} from "../actions/userBookmarkIllust";
import { 
  BOOKMARK_ILLUST, 
  UNBOOKMARK_ILLUST,
} from "../actions/bookmarkIllust";

export default function userIllust(state = {}, action) {
  switch (action.type) {
    case CLEAR_USER_BOOKMARK_ILLUSTS:
      return {
        ...state,
        [action.payload.userId]: {},
      };
    case CLEAR_ALL_USER_BOOKMARK_ILLUSTS:
      return {};  
    case REQUEST_USER_BOOKMARK_ILLUSTS:
      return {
        ...state,
        [action.payload.userId]: {
          ...state[action.payload.userId],
          loading: true
        }
      };
    case RECEIVE_USER_BOOKMARK_ILLUSTS:
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
    case STOP_USER_BOOKMARK_ILLUSTS:
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