import { ADD_NOVEL_COMMENT } from '../constants/actionTypes';

export function addNovelCommentSuccess(novelId, replyToCommentId) {
  return {
    type: ADD_NOVEL_COMMENT.ADD_SUCCESS,
    payload: {
      novelId,
      replyToCommentId,
      timestamp: Date.now(),
    },
  };
}

export function addNovelCommentFailure(novelId, replyToCommentId) {
  return {
    type: ADD_NOVEL_COMMENT.ADD_FAILURE,
    payload: {
      novelId,
      replyToCommentId,
    },
  };
}

export function addNovelComment(novelId, comment, replyToCommentId) {
  return {
    type: ADD_NOVEL_COMMENT.ADD,
    payload: {
      novelId,
      comment,
      replyToCommentId,
    },
  };
}
