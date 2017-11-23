import { NOVEL_TEXT } from '../constants/actionTypes';

export default function novelText(state = {}, action) {
  switch (action.type) {
    case NOVEL_TEXT.CLEAR:
      return {
        ...state,
        [action.payload.novelId]: {},
      };
    case NOVEL_TEXT.CLEAR_ALL:
      return {};
    case NOVEL_TEXT.REQUEST:
      return {
        ...state,
        [action.payload.novelId]: {
          ...state[action.payload.novelId],
          loading: true,
          refreshing: action.payload.refreshing,
        },
      };
    case NOVEL_TEXT.SUCCESS:
      return {
        ...state,
        [action.payload.novelId]: {
          ...state[action.payload.novelId],
          loading: false,
          loaded: true,
          refreshing: false,
          text: action.payload.text,
          timestamp: action.payload.timestamp,
        },
      };
    case NOVEL_TEXT.FAILURE:
      return {
        ...state,
        [action.payload.novelId]: {
          ...state[action.payload.novelId],
          loading: false,
          loaded: true,
          refreshing: false,
        },
      };
    default:
      return state;
  }
}
