import { 
  REQUEST_RELATED_ILLUSTS, 
  RECEIVE_RELATED_ILLUSTS, 
  STOP_RELATED_ILLUSTS, 
  CLEAR_RELATED_ILLUSTS 
} from "../actions/relatedIllust";
import { 
  BOOKMARK_ILLUST, 
  UNBOOKMARK_ILLUST,
} from "../actions/bookmarkIllust";

export function relatedIllust(state = {}, action) {
  switch (action.type) {
    case CLEAR_RELATED_ILLUSTS:
      return {
        ...state,
        [action.payload.illustId]: {},
      };
    case REQUEST_RELATED_ILLUSTS:
      return {
        ...state,
        [action.payload.illustId]: {
          ...state[action.payload.illustId],
          loading: true
        }
      };

    case RECEIVE_RELATED_ILLUSTS:
      return {
        ...state,
        [action.payload.illustId]: {
          ...state[action.payload.illustId],
          loading: false,
          loaded: true,
          items: (state[action.payload.illustId] && state[action.payload.illustId].items) ? [...state[action.payload.illustId].items, ...action.payload.items] : action.payload.items,
          offset: action.payload.offset,
          nextUrl: action.payload.nextUrl,
          lastUpdated: action.payload.receivedAt
        }
      };
    case STOP_RELATED_ILLUSTS:
      return {
        ...state,
        [action.payload.illustId]: {
          ...state[action.payload.illustId],
          loading: false
        }
      };
    case BOOKMARK_ILLUST:
      return state[action.payload.illustId] ? 
        {
          ...state,
          [action.payload.illustId]: {
            ...state[action.payload.illustId],
            items: state[action.payload.illustId].items.map(item =>
              item.id === action.payload.illustId ?
              { ...item, is_bookmarked: true } 
              :
              item
            )
          }
        }
        :
        state; 
    case UNBOOKMARK_ILLUST:
      return state[action.payload.illustId] ? 
        {
          ...state,
          [action.payload.illustId]: {
            ...state[action.payload.illustId],
            items: state[action.payload.illustId].items.map(item =>
              item.id === action.payload.illustId ?
              { ...item, is_bookmarked: false } 
              :
              item
            )
          }
        }
        :
        state;
    default:
      return state;
  }
}