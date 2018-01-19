import { SEARCH_ILLUSTS } from '../constants/actionTypes';

export default function searchIllusts(state = {}, action) {
  switch (action.type) {
    case SEARCH_ILLUSTS.CLEAR:
      return {
        ...state,
        [action.payload.navigationStateKey]: {},
      };
    case SEARCH_ILLUSTS.CLEAR_ALL:
      return {};
    case SEARCH_ILLUSTS.REQUEST:
      return {
        ...state,
        [action.payload.navigationStateKey]: {
          ...state[action.payload.navigationStateKey],
          loading: true,
          refreshing: action.payload.refreshing,
          word: action.payload.word,
          options: action.payload.options,
          offset: action.payload.offset,
        },
      };
    case SEARCH_ILLUSTS.SUCCESS:
      return {
        ...state,
        [action.payload.navigationStateKey]: {
          ...state[action.payload.navigationStateKey],
          loading: false,
          loaded: true,
          refreshing: false,
          items:
            state[action.payload.navigationStateKey] &&
            state[action.payload.navigationStateKey].items
              ? [
                  ...new Set([
                    ...state[action.payload.navigationStateKey].items,
                    ...action.payload.items,
                  ]),
                ]
              : action.payload.items,
          nextUrl: action.payload.nextUrl,
          timestamp: action.payload.timestamp,
        },
      };
    case SEARCH_ILLUSTS.FAILURE:
      return {
        ...state,
        [action.payload.navigationStateKey]: {
          ...state[action.payload.navigationStateKey],
          loading: false,
          loaded: true,
          refreshing: false,
        },
      };
    default:
      return state;
  }
}
