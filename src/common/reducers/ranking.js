import { REQUEST_RANKING, RECEIVE_RANKING, STOP_RANKING, CLEAR_RANKING, CLEAR_ALL_RANKING, RankingMode } from "../actions/ranking";

export default function search(state = {
  [RankingMode.DAILY]: {},
  [RankingMode.WEEKLY]: {},
  [RankingMode.MONTHLY]: {},
}, action) {
  switch (action.type) {
    case CLEAR_RANKING:
      return {
        ...state,
        [action.payload.rankingMode]: {},
      };
    case CLEAR_ALL_RANKING:
      return {
        [RankingMode.DAILY]: {},
        [RankingMode.WEEKLY]: {},
        [RankingMode.MONTHLY]: {},
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
    default:
      return state;
  }
}