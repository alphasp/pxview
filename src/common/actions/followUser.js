import { FOLLOW_USER, UNFOLLOW_USER } from '../constants/actionTypes';

export function followUserSuccess(userId) {
  return {
    type: FOLLOW_USER.SUCCESS,
    payload: {
      userId,
      timestamp: Date.now(),
    }
  };
}

export function unfollowUserSuccess(userId) {
  return {
    type: UNFOLLOW_USER.SUCCESS,
    payload: {
      userId, 
      timestamp: Date.now(),
    }
  };
}

export function followUserFailure(userId) {
  return {
    type: FOLLOW_USER.FAILURE,
    payload: {
      userId
    }
  };
}

export function unfollowUserFailure(userId) {
  return {
    type: UNFOLLOW_USER.FAILURE,
    payload: {
      userId
    }
  };
}

export function followUser(userId, followType) {
  return {
    type: FOLLOW_USER.REQUEST,
    payload: {
      userId,
      followType,
    }
  };
}

export function unfollowUser(userId, tags) {
  return {
    type: UNFOLLOW_USER.REQUEST,
    payload: {
      userId,
      tags,
    }
  };
}