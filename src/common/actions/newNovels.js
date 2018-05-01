import { NEW_NOVELS } from '../constants/actionTypes';

export function fetchNewNovelsSuccess(entities, items, nextUrl) {
  return {
    type: NEW_NOVELS.SUCCESS,
    payload: {
      entities,
      items,
      nextUrl,
      timestamp: Date.now(),
    },
  };
}

export function fetchNewNovelsFailure() {
  return {
    type: NEW_NOVELS.FAILURE,
  };
}

export function fetchNewNovels(nextUrl, refreshing = false) {
  return {
    type: NEW_NOVELS.REQUEST,
    payload: {
      nextUrl,
      refreshing,
    },
  };
}

export function clearNewNovels() {
  return {
    type: NEW_NOVELS.CLEAR,
  };
}
