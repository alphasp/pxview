import qs from "qs";
import { normalize } from 'normalizr';
import { addError } from './error';
import Schemas from '../constants/schemas';
import pixiv from '../helpers/ApiClient';

export const REQUEST_RELATED_ILLUSTS = 'REQUEST_RELATED_ILLUSTS';
export const RECEIVE_RELATED_ILLUSTS = 'RECEIVE_RELATED_ILLUSTS';
export const STOP_RELATED_ILLUSTS = 'STOP_RELATED_ILLUSTS';
export const CLEAR_RELATED_ILLUSTS = 'CLEAR_RELATED_ILLUSTS';

function receiveRelatedIllust(normalized, illustId, nextUrl) { 
  return {
    type: RECEIVE_RELATED_ILLUSTS,
    payload: {
      entities: normalized.entities,
      items: normalized.result,
      illustId,
      nextUrl,
      receivedAt: Date.now(),
    }
  };
}

function requestRelatedIllust(illustId, url) {
  return {
    type: REQUEST_RELATED_ILLUSTS,
    payload: {
      illustId,
      url
    }
  };
}

function stopRelatedIllust(illustId){
  return {
    type: STOP_RELATED_ILLUSTS,
    payload: {
      illustId,
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
    //no offset because next url based from seed illust ids
    dispatch(requestRelatedIllust(illustId, nextUrl));
    return promise
      .then(json => {
        const normalized = normalize(json.illusts, Schemas.ILLUST_ARRAY);
        dispatch(receiveRelatedIllust(normalized, illustId, json.next_url));
      })
      .catch(err => {
        dispatch(stopRelatedIllust(illustId));
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