import { ILLUST_COMMENTS } from '../constants/actionTypes';

const defaultState = {
  loading: false,
  loaded: false,
  refreshing: false,
  items: [],
  offset: null,
  nextUrl: null,
};

export default function illustComments(state = {}, action) {
  switch (action.type) {
    case ILLUST_COMMENTS.CLEAR:
      return {
        ...state,
        [action.payload.illustId]: defaultState,
      };
    case ILLUST_COMMENTS.REQUEST:
      return {
        ...state,
        [action.payload.illustId]: {
          ...state[action.payload.illustId],
          loading: true
        }
      };
    case ILLUST_COMMENTS.SUCCESS:
      return {
        ...state,
        [action.payload.illustId]: {
          ...state[action.payload.illustId],
          loading: false,
          loaded: true,
          items: (state[action.payload.illustId] && state[action.payload.illustId].items) ? [...state[action.payload.illustId].items, ...action.payload.items] : action.payload.items,
          offset: action.payload.offset,
          nextUrl: action.payload.nextUrl,
          timestamp: action.payload.timestamp
        }
      };
    case ILLUST_COMMENTS.FAILURE:
      return {
        ...state,
        [action.payload.illustId]: {
          ...state[action.payload.illustId],
          loading: false
        }
      };
    default:
      return state;
  }
}