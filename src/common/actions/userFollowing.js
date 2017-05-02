import qs from 'qs';
import { USER_FOLLOWING } from '../constants/actionTypes';

export function fetchUserFollowingSuccess(entities, items, userId, followingType, nextUrl) {
  return {
    type: USER_FOLLOWING.SUCCESS,
    payload: {
      userId,
      followingType,
      entities,
      items,
      nextUrl,
      timestamp: Date.now(),
    },
  };
}

export function fetchUserFollowingFailure(userId, followingType) {
  return {
    type: USER_FOLLOWING.FAILURE,
    payload: {
      userId,
      followingType,
    },
  };
}

export function fetchUserFollowing(userId, followingType, nextUrl, refreshing = false) {
  const params = qs.parse(nextUrl);
  const offset = params.offset || '0';
  return {
    type: USER_FOLLOWING.REQUEST,
    payload: {
      userId,
      followingType,
      offset,
      nextUrl,
      refreshing,
    },
  };
}

export function clearUserFollowing(userId, followingType) {
  return {
    type: USER_FOLLOWING.CLEAR,
    payload: {
      userId,
      followingType,
    },
  };
}

export function clearAllUserFollowing() {
  return {
    type: USER_FOLLOWING.CLEAR_ALL,
  };
}
