import { ILLUST_BOOKMARK_DETAIL } from '../constants/actionTypes';

const initState = {
  loading: false,
  loaded: false,
  item: {
    tags: [],
  },
};

export default function illustBookmarkDetail(state = initState, action) {
  switch (action.type) {
    case ILLUST_BOOKMARK_DETAIL.CLEAR:
      return initState;
    case ILLUST_BOOKMARK_DETAIL.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case ILLUST_BOOKMARK_DETAIL.SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        item: action.payload.item,
        timestamp: action.payload.timestamp,
      };
    case ILLUST_BOOKMARK_DETAIL.FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
      };
    default:
      return state;
  }
}
