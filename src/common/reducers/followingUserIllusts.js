import { 
  REQUEST_FOLLOWING_USER_ILLUSTS, 
  RECEIVE_FOLLOWING_USER_ILLUSTS, 
  STOP_FOLLOWING_USER_ILLUSTS, 
  CLEAR_FOLLOWING_USER_ILLUSTS,
} from "../actions/followingUserIllusts";
import { 
  BOOKMARK_ILLUST, 
  UNBOOKMARK_ILLUST,
} from "../actions/bookmarkIllust";

export default function followingUserIllusts(state = {
  loading: false,
  loaded: false,
  items: [],
  offset: 0,
  nextUrl: null,
}, action) {
  switch (action.type) {
    case CLEAR_FOLLOWING_USER_ILLUSTS:
      return {
        ...state,
        loading: false,
        loaded: false,
        items: [],
        offset: 0,
        nextUrl: null,
      };
    case REQUEST_FOLLOWING_USER_ILLUSTS:
      return {
        ...state,
        loading: true,
      };
    case RECEIVE_FOLLOWING_USER_ILLUSTS:
      return {
        ...state,
        loading: false,
        loaded: true,
        items: [...state.items, ...action.payload.items],
        offset: action.payload.offset,
        nextUrl: action.payload.nextUrl,
        timestamp: action.payload.timestamp,
      };
    case STOP_FOLLOWING_USER_ILLUSTS:
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