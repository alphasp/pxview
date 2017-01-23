import qs from "qs";
import { addError } from './error';
import pixiv from '../helpers/ApiClient';

export const REQUEST_USER_ILLUSTS = 'REQUEST_USER_ILLUSTS';
export const RECEIVE_USER_ILLUSTS = 'RECEIVE_USER_ILLUSTS';
export const STOP_USER_ILLUSTS = 'STOP_USER_ILLUSTS';
export const CLEAR_USER_ILLUSTS = 'CLEAR_USER_ILLUSTS';
export const CLEAR_ALL_USER_ILLUSTS = 'CLEAR_ALL_USER_ILLUSTS';

function receiveUserIllusts(json, userId, offset) { 
  return {
    type: RECEIVE_USER_ILLUSTS,
    payload: {
      items: json.illusts,
      nextUrl: json.next_url,
      userId,
      offset,
      receivedAt: Date.now(),
    }
  };
}

function requestUserIllusts(userId, offset) {
  return {
    type: REQUEST_USER_ILLUSTS,
    payload: {
      userId,
      offset
    }
  };
}

function stopUserIllusts(userId){
  return {
    type: STOP_USER_ILLUSTS,
    payload: {
      userId
    }
  };
}

function shouldFetchUserIllusts(state, userId) {
  if (!userId) {
    return false;
  }
  const results = state.userIllust[userId];
  if (results && results.loading) {
    return false;
  } 
  else {
    return true;
  }
}

function fetchUserIllustsFromApi(userId, nextUrl) {
  return dispatch => {
    const promise = nextUrl ? pixiv.requestUrl(nextUrl) : pixiv.userIllusts(userId);
    const params = qs.parse(nextUrl);
    const offset = params.offset || "0";
    dispatch(requestUserIllusts(userId, offset));
    return promise
      .then(json => dispatch(receiveUserIllusts(json, userId, offset)))
      .catch(err => {
        dispatch(stopUserIllusts(userId));
        dispatch(addError(err));
      });
  };
}

export function fetchUserIllusts(userId, nextUrl) {
  return (dispatch, getState) => {
    if (shouldFetchUserIllusts(getState()), userId) {
      return dispatch(fetchUserIllustsFromApi(userId, nextUrl));
    }
  };
}

export function clearUserIllusts(userId) {
  return {
    type: CLEAR_USER_ILLUSTS,
    payload: {
      userId,
    }
  };
}

export function clearAllUserIllusts() {
  return {
    type: CLEAR_ALL_USER_ILLUSTS,
  };
}