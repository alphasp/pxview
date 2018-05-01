import { NOVEL_COMMENTS } from '../constants/actionTypes';

const initState = {
  loading: false,
  loaded: false,
  refreshing: false,
  items: [],
  offset: null,
  nextUrl: null,
};

export default function novelComments(state = {}, action) {
  switch (action.type) {
    case NOVEL_COMMENTS.CLEAR:
      return {
        ...state,
        [action.payload.novelId]: initState,
      };
    case NOVEL_COMMENTS.REQUEST:
      return {
        ...state,
        [action.payload.novelId]: {
          ...state[action.payload.novelId],
          loading: true,
        },
      };
    case NOVEL_COMMENTS.SUCCESS:
      return {
        ...state,
        [action.payload.novelId]: {
          ...state[action.payload.novelId],
          loading: false,
          loaded: true,
          items:
            state[action.payload.novelId] && state[action.payload.novelId].items
              ? [
                  ...new Set([
                    ...state[action.payload.novelId].items,
                    ...action.payload.items,
                  ]),
                ]
              : action.payload.items,
          offset: action.payload.offset,
          nextUrl: action.payload.nextUrl,
          timestamp: action.payload.timestamp,
        },
      };
    case NOVEL_COMMENTS.FAILURE:
      return {
        ...state,
        [action.payload.novelId]: {
          ...state[action.payload.novelId],
          loading: false,
          loaded: true,
        },
      };
    default:
      return state;
  }
}
