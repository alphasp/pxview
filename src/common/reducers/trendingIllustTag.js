import { 
  REQUEST_TRENDING_ILLUST_TAGS, 
  RECEIVE_TRENDING_ILLUST_TAGS,
  STOP_TRENDING_ILLUST_TAGS, 
  CLEAR_TRENDING_ILLUST_TAGS,
} from "../actions/trendingIllustTag";

export function trendingIllustTag(state = {
  loading: false,
  loaded: false,
  items: [],
}, action) {
  switch (action.type) {
    case CLEAR_TRENDING_ILLUST_TAGS:
      return {
        ...state,
        loading: false,
        loaded: false,
        items: [],
      };
    case REQUEST_TRENDING_ILLUST_TAGS:
      return {
        ...state,
        loading: true,
      };

    case RECEIVE_TRENDING_ILLUST_TAGS:
      return {
        ...state,
        loading: false,
        loaded: true,
        items: [...state.items, ...action.payload.items],
        lastUpdated: action.payload.receivedAt,
      };
    case STOP_TRENDING_ILLUST_TAGS:
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
}