import { ILLUST_BOOKMARK_DETAIL } from '../constants/actionTypes';

export function fetchIllustBookmarkDetailSuccess(item, illustId) {
  return {
    type: ILLUST_BOOKMARK_DETAIL.SUCCESS,
    payload: {
      illustId,
      item,
      timestamp: Date.now(),
    }
  };
}

export function fetchIllustBookmarkDetailFailure(illustId) {
  return {
    type: ILLUST_BOOKMARK_DETAIL.FAILURE,
    payload: {
      illustId
    }
  };
}

export function fetchIllustBookmarkDetail(illustId, nextUrl) {
  return {
    type: ILLUST_BOOKMARK_DETAIL.REQUEST,
    payload: {
      illustId,
      nextUrl,
    }
  };
}

export function clearIllustBookmarkDetail(illustId) {
  return {
    type: ILLUST_BOOKMARK_DETAIL.CLEAR,
    payload: {
      illustId
    }
  };
}