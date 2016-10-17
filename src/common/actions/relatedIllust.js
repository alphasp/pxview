//import { createAction } from 'redux-actions';
import qs from "qs";
import { addError } from './error';
import pixiv from '../helpers/ApiClient';

export const REQUEST_RELATED_ILLUSTS = 'REQUEST_RELATED_ILLUSTS';
export const RECEIVE_RELATED_ILLUSTS = 'RECEIVE_RELATED_ILLUSTS';
export const STOP_RELATED_ILLUSTS = 'STOP_RELATED_ILLUSTS';
export const CLEAR_RELATED_ILLUSTS = 'CLEAR_RELATED_ILLUSTS';

function receiveRelatedIllust(json, illustId, offset) { 
  return {
    type: RECEIVE_RELATED_ILLUSTS,
    payload: {
      items: json.illusts,
      nextUrl: json.next_url,
      illustId,
      offset: offset,
      receivedAt: Date.now(),
    }
  };
}

function requestRelatedIllust(illustId, offset) {
  return {
    type: REQUEST_RELATED_ILLUSTS,
    payload: {
      illustId,
      offset
    }
  };
}

function stopRelatedIllust(illustId, offset){
  return {
    type: STOP_RELATED_ILLUSTS,
    payload: {
      illustId,
      offset
    }
  };
}

function shouldFetchRelatedIllust(state, illustId) {
  if (!illustId) {
    return false;
  }
  const results = state.relatedIllust[illustId];
  if (results && results.loading) {
    return false;
  } else {
    return true;
  }
}

function fetchRelatedIllustFromApi(illustId, options, nextUrl) {
  return dispatch => {
    const promise = nextUrl ? pixiv.requestUrl(nextUrl) : pixiv.illustRelated(illustId, options);
    const params = qs.parse(nextUrl);
    const offset = params.offset || "0";
    dispatch(requestRelatedIllust(illustId, offset));
    return promise
      .then(json => dispatch(receiveRelatedIllust(json, illustId, offset)))
      .catch(err => {
        dispatch(stopRelatedIllust(illustId, offset));
        dispatch(addError(err));
      });
  };
}

export function fetchRelatedIllusts(illustId, options, nextUrl) {
  return (dispatch, getState) => {
    if (shouldFetchRelatedIllust(getState(), illustId)) {
      return dispatch(fetchRelatedIllustFromApi(illustId, options, nextUrl));
    }
  };
}

export function clearRelatedIllusts(illustId){
  return {
    type: CLEAR_RELATED_ILLUSTS,
    payload: {
      illustId
    }
  };
}