import qs from "qs";
import { addError } from './error';
import pixiv from '../helpers/ApiClient';

export const FETCH_USER_MY_PIXIV_REQUEST = 'FETCH_USER_MY_PIXIV_REQUEST';
export const FETCH_USER_MY_PIXIV_SUCCESS = 'FETCH_USER_MY_PIXIV_SUCCESS';
export const FETCH_USER_MY_PIXIV_FAILURE = 'FETCH_USER_MY_PIXIV_FAILURE';
export const CLEAR_USER_MY_PIXIV = 'CLEAR_USER_MY_PIXIV';
export const CLEAR_ALL_USER_MY_PIXIV = 'CLEAR_ALL_USER_MY_PIXIV';

function fetchUserMyPixivRequest(userId, offset) {
  return {
    type: FETCH_USER_MY_PIXIV_REQUEST,
    payload: {
      userId,
      offset
    }
  };
}

function fetchUserMyPixivSuccess(json, userId, offset) { 
  return {
    type: FETCH_USER_MY_PIXIV_SUCCESS,
    payload: {
      userId,
      offset,
      items: json.user_previews,
      nextUrl: json.next_url,
      receivedAt: Date.now(),
    }
  };
}

function fetchUserMyPixivFailure(userId) {
  return {
    type: FETCH_USER_MY_PIXIV_FAILURE,
    payload: {
      userId,
    }
  };
}

function shouldFetchUserMyPixiv(state, userId) {
  const results = state.userMyPixiv[userId];
  if (results && results.loading) {
    return false;
  } 
  else {
    return true;
  }
}

function fetchUserMyPixivFromApi(userId, nextUrl) {
  return dispatch => {
    const promise = nextUrl ? pixiv.requestUrl(nextUrl) : pixiv.userFollower(userId);
    const params = qs.parse(nextUrl);
    const offset = params.offset || "0";
    dispatch(fetchUserMyPixivRequest(userId, offset));
    return promise
      .then(json => dispatch(fetchUserMyPixivSuccess(json, userId, offset)))
      .catch(err => {
        dispatch(fetchUserMyPixivFailure(userId));
        dispatch(addError(err));
      });
  };
}

export function fetchUserMyPixiv(userId, nextUrl) {
  return (dispatch, getState) => {
    if (shouldFetchUserMyPixiv(getState(), userId)) {
      return dispatch(fetchUserMyPixivFromApi(userId, nextUrl));
    }
  };
}

export function clearUserMyPixiv(userId) {
  return {
    type: CLEAR_USER_MY_PIXIV,
    payload: {
      userId,
    }
  };
}

export function clearAllUserMyPixiv() {
  return {
    type: CLEAR_ALL_USER_MY_PIXIV,
  };
}