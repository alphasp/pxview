import { TRENDING_NOVEL_TAGS } from '../constants/actionTypes';

const initState = {
  loading: false,
  loaded: false,
  refreshing: false,
  items: [],
};

export default function trendingIllustTags(state = initState, action) {
  switch (action.type) {
    case TRENDING_NOVEL_TAGS.CLEAR:
      return initState;
    case TRENDING_NOVEL_TAGS.REQUEST:
      return {
        ...state,
        loading: true,
        refreshing: action.payload.refreshing,
      };
    case TRENDING_NOVEL_TAGS.SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        refreshing: false,
        items: [...new Set([...state.items, ...action.payload.items])],
        timestamp: action.payload.timestamp,
      };
    case TRENDING_NOVEL_TAGS.FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        refreshing: false,
      };
    default:
      return state;
  }
}
