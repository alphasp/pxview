import { ILLUST_BOOKMARK_DETAIL } from '../constants/actionTypes';

export function fetchIllustBookmarkDetailSuccess(item, illustId) {
  return {
    type: ILLUST_BOOKMARK_DETAIL.SUCCESS,
    payload: {
      illustId,
      item,
      timestamp: Date.now(),
    },
  };
}

export function fetchIllustBookmarkDetailFailure(illustId) {
  return {
    type: ILLUST_BOOKMARK_DETAIL.FAILURE,
    payload: {
      illustId,
    },
  };
}

export function fetchIllustBookmarkDetail(illustId) {
  return {
    type: ILLUST_BOOKMARK_DETAIL.REQUEST,
    payload: {
      illustId,
    },
  };
}

export function clearIllustBookmarkDetail(illustId) {
  return {
    type: ILLUST_BOOKMARK_DETAIL.CLEAR,
    payload: {
      illustId,
    },
  };
}
