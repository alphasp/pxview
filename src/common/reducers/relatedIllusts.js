import { RELATED_ILLUSTS } from '../constants/actionTypes';

const initState = {
  loading: false,
  loaded: false,
  refreshing: false,
  items: [],
  nextUrl: null,
};

export default function relatedIllusts(state = {}, action) {
  switch (action.type) {
    case RELATED_ILLUSTS.CLEAR:
      return {
        ...state,
        [action.payload.illustId]: initState,
      };
    case RELATED_ILLUSTS.REQUEST:
      return {
        ...state,
        [action.payload.illustId]: {
          ...state[action.payload.illustId],
          loading: true,
          refreshing: action.payload.refreshing,
        },
      };

    case RELATED_ILLUSTS.SUCCESS:
      return {
        ...state,
        [action.payload.illustId]: {
          ...state[action.payload.illustId],
          loading: false,
          loaded: true,
          refreshing: false,
          items:
            state[action.payload.illustId] &&
            state[action.payload.illustId].items
              ? [
                  ...state[action.payload.illustId].items,
                  ...action.payload.items,
                ]
              : action.payload.items,
          nextUrl: action.payload.nextUrl,
          timestamp: action.payload.timestamp,
        },
      };
    case RELATED_ILLUSTS.FAILURE:
      return {
        ...state,
        [action.payload.illustId]: {
          ...state[action.payload.illustId],
          loading: false,
          loaded: true,
          refreshing: false,
        },
      };
    default:
      return state;
  }
}
