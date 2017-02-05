import qs from "qs";
import { addError } from './error';
import pixiv from '../helpers/ApiClient';

export const FETCH_USER_FOLLOWER_REQUEST = 'FETCH_USER_FOLLOWER_REQUEST';
export const FETCH_USER_FOLLOWER_SUCCESS = 'FETCH_USER_FOLLOWER_SUCCESS';
export const FETCH_USER_FOLLOWER_FAILURE = 'FETCH_USER_FOLLOWER_FAILURE';
export const CLEAR_USER_FOLLOWER = 'CLEAR_USER_FOLLOWER';
export const CLEAR_ALL_USER_FOLLOWER = 'CLEAR_ALL_USER_FOLLOWER';

function fetchUserFollowerRequest(userId, offset) {
  return {
    type: FETCH_USER_FOLLOWER_REQUEST,
    payload: {
      userId,
      offset
    }
  };
}

function fetchUserFollowerSuccess(json, userId, offset) { 
  return {
    type: FETCH_USER_FOLLOWER_SUCCESS,
    payload: {
      userId,
      offset,
      items: json.user_previews,
      nextUrl: json.next_url,
      receivedAt: Date.now(),
    }
  };
}

function fetchUserFollowerFailure(userId) {
  return {
    type: FETCH_USER_FOLLOWER_FAILURE,
    payload: {
      userId,
    }
  };
}

function shouldFetchUserFollower(state, userId) {
  //todo
  const results = state.userFollower[userId];
  if (results && results.loading) {
    return false;
  } 
  else {
    return true;
  }
}

function fetchUserFollowerFromApi(userId, nextUrl) {
  return dispatch => {
    const promise = nextUrl ? pixiv.requestUrl(nextUrl) : pixiv.userFollower(userId);
    const params = qs.parse(nextUrl);
    const offset = params.offset || "0";
    dispatch(fetchUserFollowerRequest(userId, offset));
    return promise
      .then(json => dispatch(fetchUserFollowerSuccess(json, userId, offset)))
      .catch(err => {
        dispatch(fetchUserFollowerFailure(userId));
        dispatch(addError(err));
      });
  };
}

export function fetchUserFollower(userId, nextUrl) {
  return (dispatch, getState) => {
    if (shouldFetchUserFollower(getState(), userId)) {
      return dispatch(fetchUserFollowerFromApi(userId, nextUrl));
    }
  };
}

export function clearUserFollower(userId) {
  return {
    type: CLEAR_USER_FOLLOWER,
    payload: {
      userId,
    }
  };
}

export function clearAllUserFollower() {
  return {
    type: CLEAR_ALL_USER_FOLLOWER,
  };
}