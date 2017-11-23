import { NOVEL_TEXT } from '../constants/actionTypes';

export function fetchNovelTextSuccess(text, novelId) {
  return {
    type: NOVEL_TEXT.SUCCESS,
    payload: {
      novelId,
      text,
      timestamp: Date.now(),
    },
  };
}

export function fetchNovelTextFailure(novelId) {
  return {
    type: NOVEL_TEXT.FAILURE,
    payload: {
      novelId,
    },
  };
}

export function fetchNovelText(novelId, refreshing = false) {
  return {
    type: NOVEL_TEXT.REQUEST,
    payload: {
      novelId,
      refreshing,
    },
  };
}

export function clearNovelText(novelId) {
  return {
    type: NOVEL_TEXT.CLEAR,
    payload: {
      novelId,
    },
  };
}

export function clearAllNovelText() {
  return {
    type: NOVEL_TEXT.CLEAR_ALL,
  };
}
