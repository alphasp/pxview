import { ADD_NOVEL_COMMENT } from '../constants/actionTypes';

export function addNovelCommentSuccess(novelId) {
  return {
    type: ADD_NOVEL_COMMENT.ADD_SUCCESS,
    payload: {
      novelId,
      timestamp: Date.now(),
    },
  };
}

export function addNovelCommentFailure(novelId) {
  return {
    type: ADD_NOVEL_COMMENT.ADD_FAILURE,
    payload: {
      novelId,
    },
  };
}

export function addNovelComment(novelId, comment) {
  return {
    type: ADD_NOVEL_COMMENT.ADD,
    payload: {
      novelId,
      comment,
    },
  };
}
