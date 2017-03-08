import { 
  REQUEST_SEARCH, 
  RECEIVE_SEARCH, 
  STOP_SEARCH, 
  CLEAR_SEARCH, 
  CLEAR_ALL_SEARCH,
} from "../actions/search";
//gg["newest"]["miku"]
//navigationState.key

export default function search(state = {}, action) {
  switch (action.type) {
    case CLEAR_SEARCH:
      return {
        ...state,
        [action.payload.navigationStateKey]: {},
      };
    case CLEAR_ALL_SEARCH:
      return {};
    case REQUEST_SEARCH:
      return {
        ...state,
        [action.payload.navigationStateKey]: {
          ...state[action.payload.navigationStateKey],
          word: action.payload.word,
          options: action.payload.options,
          offset: action.payload.offset,
          loading: true
        }
      };

    case RECEIVE_SEARCH:
      return {
        ...state,
        [action.payload.navigationStateKey]: {
          ...state[action.payload.navigationStateKey],
          word: action.payload.word,
          options: action.payload.options,
          loading: false,
          loaded: true,
          items: (state[action.payload.navigationStateKey] && state[action.payload.navigationStateKey].items) ? [...state[action.payload.navigationStateKey].items, ...action.payload.items] : action.payload.items,
          offset: action.payload.offset,
          nextUrl: action.payload.nextUrl,
          lastUpdated: action.payload.receivedAt
        }
      };
    case STOP_SEARCH:
      return {
        ...state,
        [action.payload.navigationStateKey]: {
          ...state[action.payload.navigationStateKey],
          word: action.payload.word,
          options: action.payload.options,
          offset: action.payload.offset,
          loading: false
        }
      };
    default:
      return state;
  }
}