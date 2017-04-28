import { NEW_MANGAS } from '../constants/actionTypes';

const defaultState = {
  loading: false,
  loaded: false,
  refreshing: false,
  items: [],
  nextUrl: null,
};

export default function newMangas(state = defaultState, action) {
  switch (action.type) {
    case NEW_MANGAS.CLEAR:
      return defaultState;
    case NEW_MANGAS.REQUEST:
      return {
        ...state,
        loading: true,
        refreshing: action.payload.refreshing
      };
    case NEW_MANGAS.SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        refreshing: false,
        items: [...state.items, ...action.payload.items],
        nextUrl: action.payload.nextUrl,
        timestamp: action.payload.timestamp,
      };
    case NEW_MANGAS.FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        refreshing: false
      };
    default:
      return state;
  }
}