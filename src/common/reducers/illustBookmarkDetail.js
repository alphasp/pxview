import { 
  FETCH_ILLUST_BOOKMARK_DETAIL_REQUEST, 
  FETCH_ILLUST_BOOKMARK_DETAIL_SUCCESS, 
  FETCH_ILLUST_BOOKMARK_DETAIL_FAILURE, 
  CLEAR_ILLUST_BOOKMARK_DETAIL,
} from '../actions/illustBookmarkDetail';

export default function illustBookmarkDetail(state = {
  loading: false,
  loaded: false,
  item: null,
  illustId: null,
}, action) {
  switch (action.type) {
    case CLEAR_ILLUST_BOOKMARK_DETAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        item: null,
        illustId: null,
      };
    case FETCH_ILLUST_BOOKMARK_DETAIL_REQUEST:
      return {
        ...state,
        loading: true,
        illustId: action.payload.illustId
      };
    case FETCH_ILLUST_BOOKMARK_DETAIL_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        item: action.payload.item,
        illustId: action.payload.illustId,
        lastUpdated: action.payload.receivedAt,
      };
    case FETCH_ILLUST_BOOKMARK_DETAIL_FAILURE:
      return {
        ...state,
        loading: false,
        illustId: action.payload.illustId,
      };
    default:
      return state;
  }
}