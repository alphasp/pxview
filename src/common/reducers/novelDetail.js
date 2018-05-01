import { NOVEL_DETAIL } from '../constants/actionTypes';

export default function novelDetail(state = {}, action) {
  switch (action.type) {
    case NOVEL_DETAIL.CLEAR:
      return {
        ...state,
        [action.payload.novelId]: {},
      };
    case NOVEL_DETAIL.CLEAR_ALL:
      return {};
    case NOVEL_DETAIL.REQUEST:
      return {
        ...state,
        [action.payload.novelId]: {
          ...state[action.payload.novelId],
          loading: true,
          refreshing: action.payload.refreshing,
        },
      };
    case NOVEL_DETAIL.SUCCESS:
      return {
        ...state,
        [action.payload.novelId]: {
          ...state[action.payload.novelId],
          loading: false,
          loaded: true,
          refreshing: false,
          item: action.payload.item,
          timestamp: action.payload.timestamp,
        },
      };
    case NOVEL_DETAIL.FAILURE:
      return {
        ...state,
        [action.payload.novelId]: {
          ...state[action.payload.novelId],
          loading: false,
          loaded: true,
          refreshing: false,
        },
      };
    default:
      return state;
  }
}
