import qs from "qs";
import { addError } from './error';
import pixiv from '../helpers/ApiClient';

export const FETCH_USER_FOLLOW_DETAIL_REQUEST = 'FETCH_USER_FOLLOW_DETAIL_REQUEST';
export const FETCH_USER_FOLLOW_DETAIL_SUCCESS = 'FETCH_USER_FOLLOW_DETAIL_SUCCESS';
export const FETCH_USER_FOLLOW_DETAIL_FAILURE = 'FETCH_USER_FOLLOW_DETAIL_FAILURE';
export const CLEAR_USER_FOLLOW_DETAIL = 'CLEAR_USER_FOLLOW_DETAIL';

function fetchUserFollowDetailRequest(userId) {
  return {
    type: FETCH_USER_FOLLOW_DETAIL_REQUEST,
    payload: {
      userId
    }
  };
}

function fetchUserFollowDetailSuccess(json, userId) { 
  return {
    type: FETCH_USER_FOLLOW_DETAIL_SUCCESS,
    payload: {
      item: json.follow_detail,
      userId,
      receivedAt: Date.now(),
    }
  };
}

function fetchUserFollowDetailFailure(userId) {
  return {
    type: FETCH_USER_FOLLOW_DETAIL_FAILURE,
    payload: {
      userId,
    }
  };
}

function shouldFetchUserFollowDetail(state) {
  const results = state.userFollowDetail;
  if (results && results.loading) {
    return false;
  } 
  else {
    return true;
  }
}

function fetchUserFollowDetailFromApi(userId) {
  return dispatch => {
    dispatch(fetchUserFollowDetailRequest(userId));
    return pixiv.userFollowDetail(userId)
      .then(json => dispatch(fetchUserFollowDetailSuccess(json, userId)))
      .catch(err => {
        dispatch(fetchUserFollowDetailFailure(userId));
        dispatch(addError(err));
      });
  };
}

export function fetchUserFollowDetail(userId) {
  return (dispatch, getState) => {
    if (shouldFetchUserFollowDetail(getState(), userId)) {
      return dispatch(fetchUserFollowDetailFromApi(userId));
    }
  };
}

export function clearUserFollowDetail(userId) {
  return {
    type: CLEAR_USER_FOLLOW_DETAIL,
    payload: {
      userId
    }
  };
}
