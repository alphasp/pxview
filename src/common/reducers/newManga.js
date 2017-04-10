import { 
  REQUEST_NEW_MANGAS, 
  RECEIVE_NEW_MANGAS, 
  STOP_NEW_MANGAS, 
  CLEAR_NEW_MANGAS,
} from "../actions/newManga";
import { 
  BOOKMARK_ILLUST, 
  UNBOOKMARK_ILLUST,
} from "../actions/bookmarkIllust";

export default function newManga(state = {
  loading: false,
  loaded: false,
  items: [],
  offset: 0,
  nextUrl: null,
}, action) {
  switch (action.type) {
    case CLEAR_NEW_MANGAS:
      return {
        ...state,
        loading: false,
        loaded: false,
        items: [],
        offset: 0,
        nextUrl: null,
      };
    case REQUEST_NEW_MANGAS:
      return {
        ...state,
        loading: true,
      };
    case RECEIVE_NEW_MANGAS:
      return {
        ...state,
        loading: false,
        loaded: true,
        items: [...state.items, ...action.payload.items],
        offset: action.payload.offset,
        nextUrl: action.payload.nextUrl,
        timestamp: action.payload.timestamp,
      };
    case STOP_NEW_MANGAS:
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