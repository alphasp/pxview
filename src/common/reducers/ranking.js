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

export default function search(state = {
  [RankingMode.DAILY]: { items: [] },
  [RankingMode.WEEKLY]: { items: [] },
  [RankingMode.MONTHLY]: { items: [] },
}, action) {
  switch (action.type) {
    case CLEAR_RANKING:
      return {
        ...state,
        [action.payload.rankingMode]: { items: [] },
      };
    case CLEAR_ALL_RANKING:
      return {
        [RankingMode.DAILY]: { items: [] },
        [RankingMode.WEEKLY]: { items: [] },
        [RankingMode.MONTHLY]: { items: [] },
      };  
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
    case BOOKMARK_ILLUST:
      return {
        ...state,
        [RankingMode.DAILY]: {
          ...state[RankingMode.DAILY],
          items: state[RankingMode.DAILY].items.map(item =>
            item.id === action.payload.illustId ?
            { ...item, is_bookmarked: true } 
            :
            item
          )
        },
        [RankingMode.WEEKLY]: {
          ...state[RankingMode.WEEKLY],
          items: state[RankingMode.WEEKLY].items.map(item =>
            item.id === action.payload.illustId ?
            { ...item, is_bookmarked: true } 
            :
            item
          )
        },
        [RankingMode.MONTHLY]: {
          ...state[RankingMode.MONTHLY],
          items: state[RankingMode.MONTHLY].items.map(item =>
            item.id === action.payload.illustId ?
            { ...item, is_bookmarked: true } 
            :
            item
          )
        },
      };
    case UNBOOKMARK_ILLUST:
      return {
        ...state,
        [RankingMode.DAILY]: {
          ...state[RankingMode.DAILY],
          items: state[RankingMode.DAILY].items.map(item =>
            item.id === action.payload.illustId ?
            { ...item, is_bookmarked: false } 
            :
            item
          )
        },
        [RankingMode.WEEKLY]: {
          ...state[RankingMode.WEEKLY],
          items: state[RankingMode.WEEKLY].items.map(item =>
            item.id === action.payload.illustId ?
            { ...item, is_bookmarked: false } 
            :
            item
          )
        },
        [RankingMode.MONTHLY]: {
          ...state[RankingMode.MONTHLY],
          items: state[RankingMode.MONTHLY].items.map(item =>
            item.id === action.payload.illustId ?
            { ...item, is_bookmarked: false } 
            :
            item
          )
        },
      };
    default:
      return state;
  }
}