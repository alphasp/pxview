//import { createAction } from 'redux-actions';
import qs from "qs";
import { addError } from './error';
import pixiv from '../helpers/ApiClient';

export const REQUEST_ILLUST_COMMENTS = 'REQUEST_ILLUST_COMMENTS';
export const RECEIVE_ILLUST_COMMENTS = 'RECEIVE_ILLUST_COMMENTS';
export const STOP_ILLUST_COMMENTS = 'STOP_ILLUST_COMMENTS';
export const CLEAR_ILLUST_COMMENTS = 'CLEAR_ILLUST_COMMENTS';

function receiveIllustComment(json, illustId, offset) { 
  return {
    type: RECEIVE_ILLUST_COMMENTS,
    payload: {
      items: json.comments,
      nextUrl: json.next_url,
      illustId,
      offset: offset,
      timestamp: Date.now(),
    }
  };
}

function requestIllustComment(illustId, offset) {
  return {
    type: REQUEST_ILLUST_COMMENTS,
    payload: {
      illustId,
      offset
    }
  };
}

function stopIllustComment(illustId, offset){
  return {
    type: STOP_ILLUST_COMMENTS,
    payload: {
      illustId,
      offset
    }
  };
}

function shouldFetchIllustComment(state, illustId) {
  if (!illustId) {
    return false;
  }
  const results = state.illustComments[illustId];
  if (results && results.loading) {
    return false;
  } else {
    return true;
  }
}

function fetchIllustCommentFromApi(illustId, options, nextUrl) {
  return dispatch => {
    const promise = nextUrl ? pixiv.requestUrl(nextUrl) : pixiv.illustComments(illustId, options);
    const params = qs.parse(nextUrl);
    const offset = params.offset || "0";
    dispatch(requestIllustComment(illustId, offset));
    return promise
      .then(json => dispatch(receiveIllustComment(json, illustId, offset)))
      .catch(err => {
        dispatch(stopIllustComment(illustId, offset));
        dispatch(addError(err));
      });
  };
}

export function fetchIllustComments(illustId, options, nextUrl) {
  return (dispatch, getState) => {
    if (shouldFetchIllustComment(getState(), illustId)) {
      return dispatch(fetchIllustCommentFromApi(illustId, options, nextUrl));
    }
  };
}

export function clearIllustComments(illustId){
  return {
    type: CLEAR_ILLUST_COMMENTS,
    payload: {
      illustId
    }
  };
}