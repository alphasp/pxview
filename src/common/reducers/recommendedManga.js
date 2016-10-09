import { REQUEST_RECOMENDED_MANGA, RECEIVE_RECOMENDED_MANGA, STOP_RECOMENDED_MANGA, CLEAR_RECOMENDED_MANGA } from "../actions/recommendedManga";

export function recommendedManga(state = {
  loading: false,
  loaded: false,
  items: [],
  offset: 0,
  nextUrl: null,
}, action) {
  switch (action.type) {
    case CLEAR_RECOMENDED_MANGA:
      return {
        ...state,
        loading: false,
        loaded: false,
        items: [],
        offset: 0,
        nextUrl: null,
      };
    case REQUEST_RECOMENDED_MANGA:
      return {
        ...state,
        loading: true,
      };

    case RECEIVE_RECOMENDED_MANGA:
      return {
        ...state,
        loading: false,
        loaded: true,
        items: [...state.items, ...action.payload.items],
        offset: action.payload.offset,
        nextUrl: action.payload.nextUrl,
        lastUpdated: action.payload.receivedAt,
      };
    case STOP_RECOMENDED_MANGA:
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
}