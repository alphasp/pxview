import { USER_FOLLOW_DETAIL } from '../constants/actionTypes';

export function fetchUserFollowDetailSuccess(item, userId) {
  return {
    type: USER_FOLLOW_DETAIL.SUCCESS,
    payload: {
      userId,
      item,
      timestamp: Date.now(),
    }
  };
}

export function fetchUserFollowDetailFailure(userId) {
  return {
    type: USER_FOLLOW_DETAIL.FAILURE,
    payload: {
      userId
    }
  };
}

export function fetchUserFollowDetail(userId) {
  return {
    type: USER_FOLLOW_DETAIL.REQUEST,
    payload: {
      userId,
    }
  };
}

export function clearUserFollowDetail(userId) {
  return {
    type: USER_FOLLOW_DETAIL.CLEAR,
    payload: {
      userId
    }
  };
}