import { 
  FETCH_MY_PIXIV_ILLUSTS_REQUEST, 
  FETCH_MY_PIXIV_ILLUSTS_SUCCESS, 
  FETCH_MY_PIXIV_ILLUSTS_FAILURE, 
  CLEAR_MY_PIXIV_ILLUSTS,
} from '../actions/myPixiv';
import { 
  BOOKMARK_ILLUST, 
  UNBOOKMARK_ILLUST,
} from '../actions/bookmarkIllust';

export default function myPixiv(state = {
  loading: false,
  loaded: false,
  items: [],
  offset: 0,
  nextUrl: null,
}, action) {
  switch (action.type) {
    case CLEAR_MY_PIXIV_ILLUSTS:
      return {
        ...state,
        loading: false,
        loaded: false,
        items: [],
        offset: 0,
        nextUrl: null,
      };
    case FETCH_MY_PIXIV_ILLUSTS_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case FETCH_MY_PIXIV_ILLUSTS_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        items: [...state.items, ...action.payload.items],
        offset: action.payload.offset,
        nextUrl: action.payload.nextUrl,
        lastUpdated: action.payload.receivedAt,
      };
    case FETCH_MY_PIXIV_ILLUSTS_FAILURE:
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