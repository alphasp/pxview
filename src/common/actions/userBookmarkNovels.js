import { USER_BOOKMARK_NOVELS } from '../constants/actionTypes';

export function fetchUserBookmarkNovelsSuccess(
  entities,
  items,
  userId,
  nextUrl,
) {
  return {
    type: USER_BOOKMARK_NOVELS.SUCCESS,
    payload: {
      userId,
      entities,
      items,
      nextUrl,
      timestamp: Date.now(),
    },
  };
}

export function fetchUserBookmarkNovelsFailure(userId) {
  return {
    type: USER_BOOKMARK_NOVELS.FAILURE,
    payload: {
      userId,
    },
  };
}

export function fetchUserBookmarkNovels(
  userId,
  tag,
  nextUrl,
  refreshing = false,
) {
  return {
    type: USER_BOOKMARK_NOVELS.REQUEST,
    payload: {
      userId,
      tag,
      nextUrl,
      refreshing,
    },
  };
}

export function clearUserBookmarkNovels(userId) {
  return {
    type: USER_BOOKMARK_NOVELS.CLEAR,
    payload: {
      userId,
    },
  };
}

export function clearAllUserBookmarkNovels() {
  return {
    type: USER_BOOKMARK_NOVELS.CLEAR_ALL,
  };
}
