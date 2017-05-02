import qs from 'qs';
import { USER_ILLUSTS } from '../constants/actionTypes';

export function fetchUserIllustsSuccess(entities, items, userId, nextUrl) {
  return {
    type: USER_ILLUSTS.SUCCESS,
    payload: {
      userId,
      entities,
      items,
      nextUrl,
      timestamp: Date.now(),
    },
  };
}

export function fetchUserIllustsFailure(userId) {
  return {
    type: USER_ILLUSTS.FAILURE,
    payload: {
      userId,
    },
  };
}

export function fetchUserIllusts(userId, nextUrl, refreshing = false) {
  const params = qs.parse(nextUrl);
  const offset = params.offset || '0';
  return {
    type: USER_ILLUSTS.REQUEST,
    payload: {
      userId,
      offset,
      nextUrl,
      refreshing,
    },
  };
}

export function clearUserIllusts(userId) {
  return {
    type: USER_ILLUSTS.CLEAR,
    payload: {
      userId,
    },
  };
}

export function clearAllUserIllusts() {
  return {
    type: USER_ILLUSTS.CLEAR_ALL,
  };
}
