import { 
  REQUEST_MY_PRIVATE_BOOKMARK_ILLUSTS, 
  RECEIVE_MY_PRIVATE_BOOKMARK_ILLUSTS,
  STOP_MY_PRIVATE_BOOKMARK_ILLUSTS, 
  CLEAR_MY_PRIVATE_BOOKMARK_ILLUSTS,
} from "../actions/myPrivateBookmarkIllust";
import { 
  BOOKMARK_ILLUST, 
  UNBOOKMARK_ILLUST,
} from "../actions/bookmarkIllust";

export default function userIllust(state = {
  loading: false,
  loaded: false,
  items: [],
  offset: 0,
  nextUrl: null,
}, action) {
  switch (action.type) {
    case CLEAR_MY_PRIVATE_BOOKMARK_ILLUSTS:
      return {
        ...state,
        loading: false,
        loaded: false,
        items: [],
        offset: 0,
        nextUrl: null,
      };
    case REQUEST_MY_PRIVATE_BOOKMARK_ILLUSTS:
      return {
        ...state,
        loading: true,
      };
    case RECEIVE_MY_PRIVATE_BOOKMARK_ILLUSTS:
      return {
        ...state,
        loading: false,
        loaded: true,
        items: [...state.items, ...action.payload.items],
        offset: action.payload.offset,
        nextUrl: action.payload.nextUrl,
        lastUpdated: action.payload.receivedAt,
      };
    case STOP_MY_PRIVATE_BOOKMARK_ILLUSTS:
      return {
        ...state,
        loading: false,
      };
    case BOOKMARK_ILLUST:
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.illustId ?
          { ...item, is_bookmarked: true } 
          :
          item
        )
      }
    case UNBOOKMARK_ILLUST:
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.illustId ?
          { ...item, is_bookmarked: false } 
          :
          item
        )
      }
    default:
      return state;
  }
}