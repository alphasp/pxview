import { BOOKMARK_NOVEL, UNBOOKMARK_NOVEL } from '../constants/actionTypes';

const initState = {
  loading: false,
  loaded: false,
};

export default function bookmarkNovel(state = initState, action) {
  switch (action.type) {
    case BOOKMARK_NOVEL.REQUEST:
    case UNBOOKMARK_NOVEL.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case BOOKMARK_NOVEL.SUCCESS:
    case UNBOOKMARK_NOVEL.SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        timestamp: action.payload.timestamp,
      };
    case BOOKMARK_NOVEL.FAILURE:
    case UNBOOKMARK_NOVEL.FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
      };
    default:
      return state;
  }
}
