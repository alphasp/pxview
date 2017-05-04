import { SEARCH } from '../constants/actionTypes';

export default function search(state = {}, action) {
  switch (action.type) {
    case SEARCH.CLEAR:
      return {
        ...state,
        [action.payload.navigationStateKey]: {},
      };
    case SEARCH.CLEAR_ALL:
      return {};
    case SEARCH.REQUEST:
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
    case SEARCH.SUCCESS:
      return {
        ...state,
        [action.payload.navigationStateKey]: {
          ...state[action.payload.navigationStateKey],
          loading: false,
          loaded: true,
          refreshing: false,
          items: state[action.payload.navigationStateKey] &&
            state[action.payload.navigationStateKey].items
            ? [
                ...state[action.payload.navigationStateKey].items,
                ...action.payload.items,
              ]
            : action.payload.items,
          nextUrl: action.payload.nextUrl,
          timestamp: action.payload.timestamp,
        },
      };
    case SEARCH.FAILURE:
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
