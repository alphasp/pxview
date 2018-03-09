import { SEARCH_NOVELS_BOOKMARK_RANGES } from '../constants/actionTypes';

export default function searchNovelsBookmarkRanges(state = {}, action) {
  switch (action.type) {
    case SEARCH_NOVELS_BOOKMARK_RANGES.CLEAR:
      return {
        ...state,
        [action.payload.navigationStateKey]: {},
      };
    case SEARCH_NOVELS_BOOKMARK_RANGES.CLEAR_ALL:
      return {};
    case SEARCH_NOVELS_BOOKMARK_RANGES.REQUEST:
      return {
        ...state,
        [action.payload.navigationStateKey]: {
          ...state[action.payload.navigationStateKey],
          loading: true,
          word: action.payload.word,
          options: action.payload.options,
        },
      };
    case SEARCH_NOVELS_BOOKMARK_RANGES.SUCCESS:
      return {
        ...state,
        [action.payload.navigationStateKey]: {
          ...state[action.payload.navigationStateKey],
          loading: false,
          loaded: true,
          items: action.payload.items,
          timestamp: action.payload.timestamp,
        },
      };
    case SEARCH_NOVELS_BOOKMARK_RANGES.FAILURE:
      return {
        ...state,
        [action.payload.navigationStateKey]: {
          ...state[action.payload.navigationStateKey],
          loading: false,
          loaded: true,
        },
      };
    default:
      return state;
  }
}
