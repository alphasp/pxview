import { ADD_NOVEL_COMMENT } from '../constants/actionTypes';

const initState = {
  loading: false,
  loaded: false,
  success: false,
};

export default function addNovelComment(state = initState, action) {
  switch (action.type) {
    case ADD_NOVEL_COMMENT.ADD:
      return {
        ...state,
        loading: true,
        success: false,
      };
    case ADD_NOVEL_COMMENT.ADD_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        success: true,
        timestamp: action.payload.timestamp,
      };
    case ADD_NOVEL_COMMENT.ADD_FAILURE:
      return {
        ...state,
        loading: false,
        loaded: true,
        success: false,
      };
    default:
      return state;
  }
}
