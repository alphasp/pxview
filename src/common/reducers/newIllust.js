import { 
  REQUEST_NEW_ILLUSTS, 
  RECEIVE_NEW_ILLUSTS, 
  STOP_NEW_ILLUSTS, 
  CLEAR_NEW_ILLUSTS,
} from "../actions/newIllust";
import { 
  BOOKMARK_ILLUST, 
  UNBOOKMARK_ILLUST,
} from "../actions/bookmarkIllust";
import { 
  FOLLOW_USER, 
  UNFOLLOW_USER,
} from "../actions/followUser";
export default function newIllust(state = {
  loading: false,
  loaded: false,
  items: [],
  offset: 0,
  nextUrl: null,
}, action) {
  switch (action.type) {
    case CLEAR_NEW_ILLUSTS:
      return {
        ...state,
        loading: false,
        loaded: false,
        items: [],
        offset: 0,
        nextUrl: null,
      };
    case REQUEST_NEW_ILLUSTS:
      return {
        ...state,
        loading: true,
      };
    case RECEIVE_NEW_ILLUSTS:
      return {
        ...state,
        loading: false,
        loaded: true,
        items: [...state.items, ...action.payload.items],
        offset: action.payload.offset,
        nextUrl: action.payload.nextUrl,
        lastUpdated: action.payload.receivedAt,
      };
    case STOP_NEW_ILLUSTS:
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
    case FOLLOW_USER:
      return {
        ...state,
        items: state.items.map(item =>
          item.user && item.user.id === action.payload.userId ?
          { 
            ...item, 
            user: {
              ...item.user,
              is_followed: true 
            }
          } 
          :
          item
        )
      }
    case UNFOLLOW_USER:
      return {
        ...state,
        items: state.items.map(item =>
          item.user && item.user.id === action.payload.userId ?
          { 
            ...item, 
            user: {
              ...item.user,
              is_followed: false 
            }
          } 
          :
          item
        )
      }
    default:
      return state;
  }
}