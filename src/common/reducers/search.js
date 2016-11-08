import { REQUEST_SEARCH, RECEIVE_SEARCH, STOP_SEARCH, CLEAR_SEARCH, CLEAR_ALL_SEARCH } from "../actions/search";
//gg["newest"]["miku"]
export function search(state = {}, action) {
  switch (action.type) {
    case CLEAR_SEARCH:
      return {
        ...state,
        [action.payload.word]: {},
      };
    case CLEAR_ALL_SEARCH:
      return {};  
    case REQUEST_SEARCH:
      return {
        ...state,
        [action.payload.word]: {
          ...state[action.payload.word],
          options: action.payload.options,
          loading: true
        }
      };

    case RECEIVE_SEARCH:
      return {
        ...state,
        [action.payload.word]: {
          ...state[action.payload.word],
          options: action.payload.options,
          loading: false,
          loaded: true,
          items: (state[action.payload.word] && state[action.payload.word].items) ? [...state[action.payload.word].items, ...action.payload.items] : action.payload.items,
          offset: action.payload.offset,
          nextUrl: action.payload.nextUrl,
          lastUpdated: action.payload.receivedAt
        }
      };
    case STOP_SEARCH:
      return {
        ...state,
        [action.payload.word]: {
          ...state[action.payload.word],
          options: action.payload.options,
          loading: false
        }
      };
    default:
      return state;
  }
}