//import { createAction } from 'redux-actions';
import qs from "qs";
import { addError } from './error';
import pixiv from '../helpers/ApiClient';

export const REQUEST_FOLLOWING_USER_ILLUSTS = 'REQUEST_FOLLOWING_USER_ILLUSTS';
export const RECEIVE_FOLLOWING_USER_ILLUSTS = 'RECEIVE_FOLLOWING_USER_ILLUSTS';
export const STOP_FOLLOWING_USER_ILLUSTS = 'STOP_FOLLOWING_USER_ILLUSTS';
export const CLEAR_FOLLOWING_USER_ILLUSTS = 'CLEAR_FOLLOWING_USER_ILLUSTS';

function receiveFollowingUserIllust(json, offset) {
  return {
    type: RECEIVE_FOLLOWING_USER_ILLUSTS,
    payload: {
      items: json.illusts,
      nextUrl: json.next_url,
      offset,
      receivedAt: Date.now(),
    }
  };
}

function requestFollowingUserIllust(offset) {
  return {
    type: REQUEST_FOLLOWING_USER_ILLUSTS,
    payload: {
      offset
    }
  };
}

function stopFollowingUserIllust() {
  return {
    type: STOP_FOLLOWING_USER_ILLUSTS
  };
}

function shouldFetchFollowingUserIllust(state) {
  const results = state.followingUserIllust;
  if (results && results.loading) {
    return false;
  } else {
    return true;
  }
}

function fetchFollowingUserIllustsFromApi(options, nextUrl) {
  return dispatch => {
    const promise = nextUrl ? pixiv.requestUrl(nextUrl) : pixiv.illustFollow(options);
    const params = qs.parse(nextUrl);
    const offset = params.offset || "0";
    dispatch(requestFollowingUserIllust(offset));
    return promise
      .then(json => dispatch(receiveFollowingUserIllust(json, offset)))
      .catch(err => {
        dispatch(stopFollowingUserIllust());
        dispatch(addError(err));
      });
  };
}

export function fetchFollowingUserIllusts(options, nextUrl) {
  return (dispatch, getState) => {
    if (shouldFetchFollowingUserIllust(getState())) {
      return dispatch(fetchFollowingUserIllustsFromApi(options, nextUrl));
    }
  };
}

export function clearFollowingUserIllust() {
  return {
    type: CLEAR_FOLLOWING_USER_ILLUSTS
  };
}
