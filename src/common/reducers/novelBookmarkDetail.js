import { NOVEL_BOOKMARK_DETAIL } from '../constants/actionTypes';

const initState = {
  loading: false,
  loaded: false,
  item: {
    tags: [],
  },
};

export default function novelBookmarkDetail(state = initState, action) {
  switch (action.type) {
    case NOVEL_BOOKMARK_DETAIL.CLEAR:
      return initState;
    case NOVEL_BOOKMARK_DETAIL.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case NOVEL_BOOKMARK_DETAIL.SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        item: action.payload.item,
        timestamp: action.payload.timestamp,
      };
    case NOVEL_BOOKMARK_DETAIL.FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
      };
    default:
      return state;
  }
}
