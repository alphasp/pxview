import { ADD_ILLUST_COMMENT } from '../constants/actionTypes';

export function addIllustCommentSuccess(illustId, replyToCommentId) {
  return {
    type: ADD_ILLUST_COMMENT.ADD_SUCCESS,
    payload: {
      illustId,
      replyToCommentId,
      timestamp: Date.now(),
    },
  };
}

export function addIllustCommentFailure(illustId, replyToCommentId) {
  return {
    type: ADD_ILLUST_COMMENT.ADD_FAILURE,
    payload: {
      illustId,
      replyToCommentId,
    },
  };
}

export function addIllustComment(illustId, comment, replyToCommentId) {
  return {
    type: ADD_ILLUST_COMMENT.ADD,
    payload: {
      illustId,
      comment,
      replyToCommentId,
    },
  };
}
