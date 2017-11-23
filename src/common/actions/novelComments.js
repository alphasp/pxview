import qs from 'qs';
import { NOVEL_COMMENTS } from '../constants/actionTypes';

export function fetchNovelCommentsSuccess(entities, items, novelId, nextUrl) {
  return {
    type: NOVEL_COMMENTS.SUCCESS,
    payload: {
      novelId,
      entities,
      items,
      nextUrl,
      timestamp: Date.now(),
    },
  };
}

export function fetchNovelCommentsFailure(novelId) {
  return {
    type: NOVEL_COMMENTS.FAILURE,
    payload: {
      novelId,
    },
  };
}

export function fetchNovelComments(
  novelId,
  options,
  nextUrl,
  refreshing = false,
) {
  const params = qs.parse(nextUrl);
  const offset = params.offset || '0';
  return {
    type: NOVEL_COMMENTS.REQUEST,
    payload: {
      novelId,
      options,
      offset,
      nextUrl,
      refreshing,
    },
  };
}

export function clearNovelComments(novelId) {
  return {
    type: NOVEL_COMMENTS.CLEAR,
    payload: {
      novelId,
    },
  };
}
