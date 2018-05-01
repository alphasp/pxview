import { NOVEL_DETAIL } from '../constants/actionTypes';

export function fetchNovelDetailSuccess(entities, item, novelId) {
  return {
    type: NOVEL_DETAIL.SUCCESS,
    payload: {
      novelId,
      entities,
      item,
      timestamp: Date.now(),
    },
  };
}

export function fetchNovelDetailFailure(novelId) {
  return {
    type: NOVEL_DETAIL.FAILURE,
    payload: {
      novelId,
    },
  };
}

export function fetchNovelDetail(novelId, refreshing = false) {
  return {
    type: NOVEL_DETAIL.REQUEST,
    payload: {
      novelId,
      refreshing,
    },
  };
}

export function clearNovelDetail(novelId) {
  return {
    type: NOVEL_DETAIL.CLEAR,
    payload: {
      novelId,
    },
  };
}

export function clearAllNovelDetail() {
  return {
    type: NOVEL_DETAIL.CLEAR_ALL,
  };
}
