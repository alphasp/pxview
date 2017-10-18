import { UGOIRA_META } from '../constants/actionTypes';

export default function ugoiraMeta(state = {}, action) {
  switch (action.type) {
    case UGOIRA_META.CLEAR:
      return {
        ...state,
        [action.payload.illustId]: {},
      };
    case UGOIRA_META.CLEAR_ALL:
      return {};
    case UGOIRA_META.REQUEST:
      return {
        ...state,
        [action.payload.illustId]: {
          ...state[action.payload.illustId],
          loading: true,
          refreshing: action.payload.refreshing,
        },
      };
    case UGOIRA_META.SUCCESS:
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
    case UGOIRA_META.FAILURE:
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
