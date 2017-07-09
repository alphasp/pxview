import qs from 'qs';
import { ILLUST_COMMENTS } from '../constants/actionTypes';

export function fetchIllustCommentsSuccess(entities, items, illustId, nextUrl) {
  return {
    type: ILLUST_COMMENTS.SUCCESS,
    payload: {
      illustId,
      entities,
      items,
      nextUrl,
      timestamp: Date.now(),
    },
  };
}

export function fetchIllustCommentsFailure(illustId) {
  return {
    type: ILLUST_COMMENTS.FAILURE,
    payload: {
      illustId,
    },
  };
}

export function fetchIllustComments(
  illustId,
  options,
  nextUrl,
  refreshing = false,
) {
  const params = qs.parse(nextUrl);
  const offset = params.offset || '0';
  return {
    type: ILLUST_COMMENTS.REQUEST,
    payload: {
      illustId,
      options,
      offset,
      nextUrl,
      refreshing,
    },
  };
}

export function clearIllustComments(illustId) {
  return {
    type: ILLUST_COMMENTS.CLEAR,
    payload: {
      illustId,
    },
  };
}
