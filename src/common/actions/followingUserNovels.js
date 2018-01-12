import qs from 'qs';
import { FOLLOWING_USER_NOVELS } from '../constants/actionTypes';

export function fetchFollowingUserNovelsSuccess(entities, items, nextUrl) {
  return {
    type: FOLLOWING_USER_NOVELS.SUCCESS,
    payload: {
      entities,
      items,
      nextUrl,
      timestamp: Date.now(),
    },
  };
}

export function fetchFollowingUserNovelsFailure() {
  return {
    type: FOLLOWING_USER_NOVELS.FAILURE,
  };
}

export function fetchFollowingUserNovels(nextUrl, refreshing = false) {
  const params = qs.parse(nextUrl);
  const offset = params.offset || '0';
  return {
    type: FOLLOWING_USER_NOVELS.REQUEST,
    payload: {
      offset,
      nextUrl,
      refreshing,
    },
  };
}

export function clearFollowingUserNovels() {
  return {
    type: FOLLOWING_USER_NOVELS.CLEAR,
  };
}
