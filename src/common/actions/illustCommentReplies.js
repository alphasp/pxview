import qs from 'qs';
import { ILLUST_COMMENT_REPLIES } from '../constants/actionTypes';

export function fetchIllustCommentRepliesSuccess(
  entities,
  items,
  commentId,
  nextUrl,
) {
  return {
    type: ILLUST_COMMENT_REPLIES.SUCCESS,
    payload: {
      commentId,
      entities,
      items,
      nextUrl,
      timestamp: Date.now(),
    },
  };
}

export function fetchIllustCommentRepliesFailure(commentId) {
  return {
    type: ILLUST_COMMENT_REPLIES.FAILURE,
    payload: {
      commentId,
    },
  };
}

export function fetchIllustCommentReplies(commentId, options, nextUrl) {
  const params = qs.parse(nextUrl);
  const offset = params.offset || '0';
  return {
    type: ILLUST_COMMENT_REPLIES.REQUEST,
    payload: {
      commentId,
      options,
      offset,
      nextUrl,
    },
  };
}

export function clearIllustCommentReplies(commentId) {
  return {
    type: ILLUST_COMMENT_REPLIES.CLEAR,
    payload: {
      commentId,
    },
  };
}
