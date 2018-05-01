import { MY_PRIVATE_BOOKMARK_NOVELS } from '../constants/actionTypes';

export function fetchMyPrivateBookmarkNovelsSuccess(
  entities,
  items,
  userId,
  nextUrl,
) {
  return {
    type: MY_PRIVATE_BOOKMARK_NOVELS.SUCCESS,
    payload: {
      userId,
      entities,
      items,
      nextUrl,
      timestamp: Date.now(),
    },
  };
}

export function fetchMyPrivateBookmarkNovelsFailure(userId) {
  return {
    type: MY_PRIVATE_BOOKMARK_NOVELS.FAILURE,
    payload: {
      userId,
    },
  };
}

export function fetchMyPrivateBookmarkNovels(
  userId,
  tag,
  nextUrl,
  refreshing = false,
) {
  return {
    type: MY_PRIVATE_BOOKMARK_NOVELS.REQUEST,
    payload: {
      userId,
      tag,
      nextUrl,
      refreshing,
    },
  };
}

export function clearMyPrivateBookmarkNovels(userId) {
  return {
    type: MY_PRIVATE_BOOKMARK_NOVELS.CLEAR,
    payload: {
      userId,
    },
  };
}
