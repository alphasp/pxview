import qs from 'qs';
import { USER_FOLLOWERS } from '../constants/actionTypes';

export function fetchUserFollowersSuccess(entities, items, userId, nextUrl) {
  return {
    type: USER_FOLLOWERS.SUCCESS,
    payload: {
      userId,
      entities,
      items,
      nextUrl,
      timestamp: Date.now(),
    },
  };
}

export function fetchUserFollowersFailure(userId) {
  return {
    type: USER_FOLLOWERS.FAILURE,
    payload: {
      userId,
    },
  };
}

export function fetchUserFollowers(userId, nextUrl, refreshing = false) {
  const params = qs.parse(nextUrl);
  const offset = params.offset || '0';
  return {
    type: USER_FOLLOWERS.REQUEST,
    payload: {
      userId,
      offset,
      nextUrl,
      refreshing,
    },
  };
}

export function clearUserFollowers(userId) {
  return {
    type: USER_FOLLOWERS.CLEAR,
    payload: {
      userId,
    },
  };
}

export function clearAllUserFollowers() {
  return {
    type: USER_FOLLOWERS.CLEAR_ALL,
  };
}
