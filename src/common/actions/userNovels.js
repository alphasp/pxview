import qs from 'qs';
import { USER_NOVELS } from '../constants/actionTypes';

export function fetchUserNovelsSuccess(entities, items, userId, nextUrl) {
  return {
    type: USER_NOVELS.SUCCESS,
    payload: {
      userId,
      entities,
      items,
      nextUrl,
      timestamp: Date.now(),
    },
  };
}

export function fetchUserNovelsFailure(userId) {
  return {
    type: USER_NOVELS.FAILURE,
    payload: {
      userId,
    },
  };
}

export function fetchUserNovels(userId, nextUrl, refreshing = false) {
  const params = qs.parse(nextUrl);
  const offset = params.offset || '0';
  return {
    type: USER_NOVELS.REQUEST,
    payload: {
      userId,
      offset,
      nextUrl,
      refreshing,
    },
  };
}

export function clearUserNovels(userId) {
  return {
    type: USER_NOVELS.CLEAR,
    payload: {
      userId,
    },
  };
}

export function clearAllUserNovels() {
  return {
    type: USER_NOVELS.CLEAR_ALL,
  };
}
