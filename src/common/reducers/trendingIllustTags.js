import { TRENDING_ILLUST_TAGS } from '../constants/actionTypes';

const defaultState = {
  loading: false,
  loaded: false,
  refreshing: false,
  items: [],
};

export default function trendingIllustTags(state = defaultState, action) {
  switch (action.type) {
    case TRENDING_ILLUST_TAGS.CLEAR:
      return defaultState;
    case TRENDING_ILLUST_TAGS.REQUEST:
      return {
        ...state,
        loading: true,
        refreshing: action.payload.refreshing
      };
    case TRENDING_ILLUST_TAGS.SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        refreshing: false,
        items: [...state.items, ...action.payload.items],
        timestamp: action.payload.timestamp,
      };
    case TRENDING_ILLUST_TAGS.FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        refreshing: false
      };
    default:
      return state;
  }
}