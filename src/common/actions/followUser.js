import qs from "qs";
import { addError } from './error';
import pixiv from '../helpers/ApiClient';

export const FOLLOW_USER = 'FOLLOW_USER';
export const FOLLOW_USER_SUCCESS = 'FOLLOW_USER_SUCCESS';
export const FOLLOW_USER_FAILURE = 'FOLLOW_USER_FAILURE';
export const UNFOLLOW_USER = 'UNFOLLOW_USER';
export const UNFOLLOW_USER_SUCCESS = 'UNFOLLOW_USER_SUCCESS';
export const UNFOLLOW_USER_FAILURE = 'UNFOLLOW_USER_FAILURE';

export const FollowType = {
  PUBLIC: 'PUBLIC',
  PRIVATE: 'PRIVATE',
};

export const FollowActionType = {
  FOLLOW: 'FOLLOW',
  UNFOLLOW: 'UNFOLLOW'
};

function createFollowUser(userId, followType) {
  return {
    type: FOLLOW_USER,
    payload: {
      userId,
      followType,
    }
  };
}

function deleteFollowUser(userId) {
  return {
    type: UNFOLLOW_USER,
    payload: {
      userId,
    }
  };
}

function followUserSuccess(userId, followType) {
  return {
    type: FOLLOW_USER_SUCCESS,
    payload: {
      userId, 
      followType, 
      timestamp: Date.now(),
    }
  };
}

function followUserFailure(userId, followType) {
  return {
    type: FOLLOW_USER_FAILURE,
    payload: {
      userId,
      followType,
    }
  };
}

function unFollowUserSuccess(userId) {
  return {
    type: UNFOLLOW_USER_SUCCESS,
    payload: {
      userId, 
      timestamp: Date.now(),
    }
  };
}

function unFollowUserFailure(userId) {
  return {
    type: UNFOLLOW_USER_FAILURE,
    payload: {
      userId,
    }
  };
}

function followUserFromApi(userId, followActionType, followType)  {
  const followTypeString = followType === FollowType.PRIVATE ? 'private' : 'public';
  return dispatch => {
    dispatch(
      followActionType === FollowActionType.FOLLOW ? 
      createFollowUser(userId, followType)
      :
      deleteFollowUser(userId)
    );
    const promise = 
      followActionType === FollowActionType.FOLLOW ? 
      pixiv.followUser(userId, followTypeString)
      : 
      pixiv.unfollowUser(userId);
    return promise
      .then(json => {
        dispatch(
          followActionType === FollowActionType.FOLLOW ? 
          followUserSuccess(userId, followType)
          :
          unFollowUserSuccess(userId)
        );
      })
      .catch(err => {
        dispatch(
          followActionType === FollowActionType.FOLLOW ? 
          followUserFailure(userId, followType)
          :
          unFollowUserFailure(userId)
        );
        dispatch(addError(err));
      });
  };
}

export function followUser(userId, followType) {
  return (dispatch, getState) => {
    return dispatch(followUserFromApi(userId, FollowActionType.FOLLOW, followType)); 
  };
}

export function unFollowUser(userId) {
  return (dispatch, getState) => {
    return dispatch(followUserFromApi(userId, FollowActionType.UNFOLLOW));
  };
}