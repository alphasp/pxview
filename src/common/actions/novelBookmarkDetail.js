import { NOVEL_BOOKMARK_DETAIL } from '../constants/actionTypes';

export function fetchNovelBookmarkDetailSuccess(item, novelId) {
  return {
    type: NOVEL_BOOKMARK_DETAIL.SUCCESS,
    payload: {
      novelId,
      item,
      timestamp: Date.now(),
    },
  };
}

export function fetchNovelBookmarkDetailFailure(novelId) {
  return {
    type: NOVEL_BOOKMARK_DETAIL.FAILURE,
    payload: {
      novelId,
    },
  };
}

export function fetchNovelBookmarkDetail(novelId) {
  return {
    type: NOVEL_BOOKMARK_DETAIL.REQUEST,
    payload: {
      novelId,
    },
  };
}

export function clearNovelBookmarkDetail(novelId) {
  return {
    type: NOVEL_BOOKMARK_DETAIL.CLEAR,
    payload: {
      novelId,
    },
  };
}
