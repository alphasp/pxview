import { 
  BOOKMARK_ILLUST, 
  BOOKMARK_ILLUST_SUCCESS, 
  BOOKMARK_ILLUST_FAILURE, 
  UNBOOKMARK_ILLUST,
  UNBOOKMARK_ILLUST_SUCCESS,
  UNBOOKMARK_ILLUST_FAILURE,
} from "../actions/bookmarkIllust";

//unused
export default function bookmarkIllust(state = {
  loading: false,
  loaded: false,
}, action) {
  switch (action.type) {
    case BOOKMARK_ILLUST:
      return {
        ...state,
        loading: true,
      };
    case BOOKMARK_ILLUST_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        timestamp: action.payload.timestamp,
      };
    case BOOKMARK_ILLUST_FAILURE:
      return {
        ...state,
        loading: false,
      };
    case UNBOOKMARK_ILLUST:
      return {
        ...state,
        loading: true,
      };
    case UNBOOKMARK_ILLUST_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        timestamp: action.payload.timestamp,
      };
    case UNBOOKMARK_ILLUST_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true
      };
    default:
      return state;
  }
}