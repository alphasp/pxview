import { ILLUST_DETAIL } from '../constants/actionTypes';

export default function illustDetail(state = {}, action) {
  switch (action.type) {
    case ILLUST_DETAIL.CLEAR:
      return {
        ...state,
        [action.payload.illustId]: {},
      };
    case ILLUST_DETAIL.CLEAR_ALL:
      return {};
    case ILLUST_DETAIL.REQUEST:
      return {
        ...state,
        [action.payload.illustId]: {
          ...state[action.payload.illustId],
          loading: true,
          refreshing: action.payload.refreshing,
        },
      };
    case ILLUST_DETAIL.SUCCESS:
      return {
        ...state,
        [action.payload.illustId]: {
          ...state[action.payload.illustId],
          loading: false,
          loaded: true,
          refreshing: false,
          item: action.payload.item,
          timestamp: action.payload.timestamp,
        },
      };
    case ILLUST_DETAIL.FAILURE:
      return {
        ...state,
        [action.payload.illustId]: {
          ...state[action.payload.illustId],
          loading: false,
          loaded: true,
          refreshing: false,
        },
      };
    default:
      return state;
  }
}
