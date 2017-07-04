import { NEW_ILLUSTS } from '../constants/actionTypes';

const initState = {
  loading: false,
  loaded: false,
  refreshing: false,
  items: [],
  nextUrl: null,
};

export default function newIllusts(state = initState, action) {
  switch (action.type) {
    case NEW_ILLUSTS.CLEAR:
      return initState;
    case NEW_ILLUSTS.REQUEST:
      return {
        ...state,
        loading: true,
        refreshing: action.payload.refreshing,
      };
    case NEW_ILLUSTS.SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        refreshing: false,
        items: [...state.items, ...action.payload.items],
        nextUrl: action.payload.nextUrl,
        timestamp: action.payload.timestamp,
      };
    case NEW_ILLUSTS.FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        refreshing: false,
      };
    default:
      return state;
  }
}
