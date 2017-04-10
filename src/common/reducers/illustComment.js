import { 
  REQUEST_ILLUST_COMMENTS, 
  RECEIVE_ILLUST_COMMENTS, 
  STOP_ILLUST_COMMENTS, 
  CLEAR_ILLUST_COMMENTS 
} from "../actions/illustComment";

export function illustComment(state = {}, action) {
  switch (action.type) {
    case CLEAR_ILLUST_COMMENTS:
      return {
        ...state,
        [action.payload.illustId]: {},
      };
    case REQUEST_ILLUST_COMMENTS:
      return {
        ...state,
        [action.payload.illustId]: {
          ...state[action.payload.illustId],
          loading: true
        }
      };
    case RECEIVE_ILLUST_COMMENTS:
      return {
        ...state,
        [action.payload.illustId]: {
          ...state[action.payload.illustId],
          loading: false,
          loaded: true,
          items: (state[action.payload.illustId] && state[action.payload.illustId].items) ? [...state[action.payload.illustId].items, ...action.payload.items] : action.payload.items,
          offset: action.payload.offset,
          nextUrl: action.payload.nextUrl,
          timestamp: action.payload.timestamp
        }
      };
    case STOP_ILLUST_COMMENTS:
      return {
        ...state,
        [action.payload.illustId]: {
          ...state[action.payload.illustId],
          loading: false
        }
      };
    default:
      return state;
  }
}