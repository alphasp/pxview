import qs from 'qs';
import { USER_MANGAS } from '../constants/actionTypes';

export function fetchUserMangasSuccess(entities, items, userId, nextUrl) {
  return {
    type: USER_MANGAS.SUCCESS,
    payload: {
      userId,
      entities,
      items,
      nextUrl,
      timestamp: Date.now(),
    },
  };
}

export function fetchUserMangasFailure(userId) {
  return {
    type: USER_MANGAS.FAILURE,
    payload: {
      userId,
    },
  };
}

export function fetchUserMangas(userId, nextUrl, refreshing = false) {
  const params = qs.parse(nextUrl);
  const offset = params.offset || '0';
  return {
    type: USER_MANGAS.REQUEST,
    payload: {
      userId,
      offset,
      nextUrl,
      refreshing,
    },
  };
}

export function clearUserMangas(userId) {
  return {
    type: USER_MANGAS.CLEAR,
    payload: {
      userId,
    },
  };
}

export function clearAllUserIllusts() {
  return {
    type: USER_MANGAS.CLEAR_ALL,
  };
}
