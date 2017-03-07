import { 
  REQUEST_RECOMMENDED_MANGAS, 
  RECEIVE_RECOMMENDED_MANGAS, 
  STOP_RECOMMENDED_MANGAS, 
  CLEAR_RECOMMENDED_MANGAS,
} from "../actions/recommendedManga";
import { 
  BOOKMARK_ILLUST, 
  UNBOOKMARK_ILLUST,
} from "../actions/bookmarkIllust";

export function recommendedManga(state = {
  loading: false,
  loaded: false,
  items: [],
  offset: 0,
  nextUrl: null,
}, action) {
  switch (action.type) {
    case CLEAR_RECOMMENDED_MANGAS:
      return {
        ...state,
        loading: false,
        loaded: false,
        items: [],
        offset: 0,
        nextUrl: null,
      };
    case REQUEST_RECOMMENDED_MANGAS:
      return {
        ...state,
        loading: true,
      };
    case RECEIVE_RECOMMENDED_MANGAS:
      return {
        ...state,
        loading: false,
        loaded: true,
        items: [...state.items, ...action.payload.items],
        offset: action.payload.offset,
        nextUrl: action.payload.nextUrl,
        lastUpdated: action.payload.receivedAt,
      };
    case STOP_RECOMMENDED_MANGAS:
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
}