//import { createAction } from 'redux-actions';
import qs from "qs";
import { addError } from './error';
import pixiv from '../helpers/ApiClient';

export const REQUEST_NEW_ILLUSTS = 'REQUEST_NEW_ILLUSTS';
export const RECEIVE_NEW_ILLUSTS = 'RECEIVE_NEW_ILLUSTS';
export const STOP_NEW_ILLUSTS = 'STOP_NEW_ILLUSTS';
export const CLEAR_NEW_ILLUSTS = 'CLEAR_NEW_ILLUSTS';

function receiveNewIllusts(json, offset) {
  return {
    type: RECEIVE_NEW_ILLUSTS,
    payload: {
      items: json.illusts,
      nextUrl: json.next_url,
      offset,
      receivedAt: Date.now(),
    }
  };
}

export function requestNewIllusts(offset) {
  return {
    type: REQUEST_NEW_ILLUSTS,
    payload: {
      offset
    }
  };
}

function stopNewIllusts() {
  return {
    type: STOP_NEW_ILLUSTS
  };
}

function shouldFetchNewIllusts(state) {
  const results = state.newIllust;
  if (results && results.loading) {
    return false;
  } else {
    return true;
  }
}

function fetchNewIllustsFromApi(options, nextUrl) {
  return dispatch => {
    const promise = nextUrl ? pixiv.requestUrl(nextUrl) : pixiv.illustNew(options);
    const params = qs.parse(nextUrl);
    const offset = params.offset || "0";
    dispatch(requestNewIllusts(offset));
    return promise
      .then(json => dispatch(receiveNewIllusts(json, offset)))
      .catch(err => {
        dispatch(stopNewIllusts());
        dispatch(addError(err));
      });
  };
}

export function fetchNewIllusts(options, nextUrl) {
  return (dispatch, getState) => {
    if (shouldFetchNewIllusts(getState())) {
      return dispatch(fetchNewIllustsFromApi(options, nextUrl));
    }
  };
}

export function clearNewIllusts() {
  return {
    type: CLEAR_NEW_ILLUSTS
  };
}
