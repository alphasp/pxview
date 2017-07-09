import { ADD_ILLUST_COMMENT } from '../constants/actionTypes';

export function addIllustCommentSuccess(illustId) {
  return {
    type: ADD_ILLUST_COMMENT.ADD_SUCCESS,
    payload: {
      illustId,
      timestamp: Date.now(),
    },
  };
}

export function addIllustCommentFailure(illustId) {
  return {
    type: ADD_ILLUST_COMMENT.ADD_FAILURE,
    payload: {
      illustId,
    },
  };
}

export function addIllustComment(illustId, comment) {
  return {
    type: ADD_ILLUST_COMMENT.ADD,
    payload: {
      illustId,
      comment,
    },
  };
}
