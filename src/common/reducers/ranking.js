import { 
  REQUEST_RANKING, 
  RECEIVE_RANKING, 
  STOP_RANKING, 
  CLEAR_RANKING, 
  CLEAR_ALL_RANKING, 
  RankingMode 
} from "../actions/ranking";
import { 
  BOOKMARK_ILLUST, 
  UNBOOKMARK_ILLUST,
} from "../actions/bookmarkIllust";

function getDefaultState() {
  return Object.keys(RankingMode).reduce((prev, key) => {
    prev[key] = { items: [] };
    return prev;
  }, {});
}
export default function search(state = getDefaultState(), action) {
  switch (action.type) {
    case CLEAR_RANKING:
      return {
        ...state,
        [action.payload.rankingMode]: { items: [] },
      };
    case CLEAR_ALL_RANKING:
      return getDefaultState();  
    case REQUEST_RANKING:
      return {
        ...state,
        [action.payload.rankingMode]: {
          ...state[action.payload.rankingMode],
          options: action.payload.options,
          offset: action.payload.offset,
          loading: true,
        }
      };
    case RECEIVE_RANKING:
      return {
        ...state,
        [action.payload.rankingMode]: {
          ...state[action.payload.rankingMode],
          options: action.payload.options,
          loading: false,
          loaded: true,
          items: (state[action.payload.rankingMode] && state[action.payload.rankingMode].items) ? [...state[action.payload.rankingMode].items, ...action.payload.items] : action.payload.items,
          offset: action.payload.offset,
          nextUrl: action.payload.nextUrl,
          lastUpdated: action.payload.receivedAt
        }
      };
    case STOP_RANKING:
      return {
        ...state,
        [action.payload.rankingMode]: {
          ...state[action.payload.rankingMode],
          options: action.payload.options,
          offset: action.payload.offset,
          loading: false
        }
      };
    default:
      return state;
  }
}