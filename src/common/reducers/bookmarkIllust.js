import { BOOKMARK_ILLUST, UNBOOKMARK_ILLUST } from '../constants/actionTypes';

const defaultState = {
  loading: false,
  loaded: false,
};

// unused
export default function bookmarkIllust(state = defaultState, action) {
  switch (action.type) {
    case BOOKMARK_ILLUST.REQUEST:
    case UNBOOKMARK_ILLUST.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case BOOKMARK_ILLUST.SUCCESS:
    case UNBOOKMARK_ILLUST.SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        timestamp: action.payload.timestamp,
      };
    case BOOKMARK_ILLUST.FAILURE:
    case UNBOOKMARK_ILLUST.FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
      };
    default:
      return state;
  }
}
