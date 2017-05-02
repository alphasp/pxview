import qs from 'qs';
import { MY_PRIVATE_BOOKMARK_ILLUSTS } from '../constants/actionTypes';

export function fetchMyPrivateBookmarkIllustsSuccess(entities, items, userId, nextUrl) {
  return {
    type: MY_PRIVATE_BOOKMARK_ILLUSTS.SUCCESS,
    payload: {
      userId,
      entities,
      items,
      nextUrl,
      timestamp: Date.now(),
    },
  };
}

export function fetchMyPrivateBookmarkIllustsFailure(userId) {
  return {
    type: MY_PRIVATE_BOOKMARK_ILLUSTS.FAILURE,
    payload: {
      userId,
    },
  };
}

export function fetchMyPrivateBookmarkIllusts(userId, tag, nextUrl, refreshing = false) {
  return {
    type: MY_PRIVATE_BOOKMARK_ILLUSTS.REQUEST,
    payload: {
      userId,
      tag,
      nextUrl,
      refreshing,
    },
  };
}

export function clearMyPrivateBookmarkIllusts(userId) {
  return {
    type: MY_PRIVATE_BOOKMARK_ILLUSTS.CLEAR,
    payload: {
      userId,
    },
  };
}
