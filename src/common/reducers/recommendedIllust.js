import { REQUEST_RECOMENDED_ILLUSTS, RECEIVE_RECOMENDED_ILLUSTS, STOP_RECOMENDED_ILLUSTS, CLEAR_RECOMENDED_ILLUSTS } from "../actions/recommendedIllust";

export function recommendedIllust(state = {
  loading: false,
  loaded: false,
  items: [],
  offset: 0,
  nextUrl: null,
}, action) {
  switch (action.type) {
    case CLEAR_RECOMENDED_ILLUSTS:
      return {
        ...state,
        loading: false,
        loaded: false,
        items: [],
        offset: 0,
        nextUrl: null,
      };
    case REQUEST_RECOMENDED_ILLUSTS:
      return {
        ...state,
        loading: true,
      };

    case RECEIVE_RECOMENDED_ILLUSTS:
      return {
        ...state,
        loading: false,
        loaded: true,
        items: [...state.items, ...action.payload.items],
        offset: action.payload.offset,
        nextUrl: action.payload.nextUrl,
        lastUpdated: action.payload.receivedAt,
      };
    case STOP_RECOMENDED_ILLUSTS:
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
}