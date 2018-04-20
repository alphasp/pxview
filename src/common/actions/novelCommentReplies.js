import qs from 'qs';
import { NOVEL_COMMENT_REPLIES } from '../constants/actionTypes';

export function fetchNovelCommentRepliesSuccess(
  entities,
  items,
  commentId,
  nextUrl,
) {
  return {
    type: NOVEL_COMMENT_REPLIES.SUCCESS,
    payload: {
      commentId,
      entities,
      items,
      nextUrl,
      timestamp: Date.now(),
    },
  };
}

export function fetchNovelCommentRepliesFailure(commentId) {
  return {
    type: NOVEL_COMMENT_REPLIES.FAILURE,
    payload: {
      commentId,
    },
  };
}

export function fetchNovelCommentReplies(commentId, options, nextUrl) {
  const params = qs.parse(nextUrl);
  const offset = params.offset || '0';
  return {
    type: NOVEL_COMMENT_REPLIES.REQUEST,
    payload: {
      commentId,
      options,
      offset,
      nextUrl,
    },
  };
}

export function clearNovelCommentReplies(commentId) {
  return {
    type: NOVEL_COMMENT_REPLIES.CLEAR,
    payload: {
      commentId,
    },
  };
}
