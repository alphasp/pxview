//import { createAction } from 'redux-actions';
import qs from "qs";
import { addError } from './error';
import pixiv from '../helpers/ApiClient';

export const REQUEST_RECOMMENDED_ILLUSTS = 'REQUEST_RECOMMENDED_ILLUSTS';
export const RECEIVE_RECOMMENDED_ILLUSTS = 'RECEIVE_RECOMMENDED_ILLUSTS';
export const STOP_RECOMMENDED_ILLUSTS = 'STOP_RECOMMENDED_ILLUSTS';
export const CLEAR_RECOMMENDED_ILLUSTS = 'CLEAR_RECOMMENDED_ILLUSTS';

function receiveRecommended(json, offset) { 
  return {
    type: RECEIVE_RECOMMENDED_ILLUSTS,
    payload: {
      items: json.illusts,
      nextUrl: json.next_url,
      offset: offset,
      receivedAt: Date.now(),
    }
  };
}

function requestRecommended(offset) {
  return {
    type: REQUEST_RECOMMENDED_ILLUSTS,
    payload: {
      offset
    }
  };
}

function stopRecommended(){
  return {
    type: STOP_RECOMMENDED_ILLUSTS
  };
}

function shouldFetchRecommended(state) {
  const results = state.recommendedIllust;
  if (results && results.loading) {
    return false;
  } else {
    return true;
  }
}

function fetchRecommendedFromApi(options, nextUrl) {
  //const { nextUrl } = getState().recommended.nextUrl;
  return dispatch => {
    dispatch(requestRecommended());
    return pixiv.illustRecommended(options, nextUrl)
      .then(json => dispatch(receiveRecommended(json)))
      .catch(err => {
        dispatch(stopRecommended());
        dispatch(addError(err));
      });
  };
}

function fetchRecommendedPublicFromApi(options, nextUrl) {
  return dispatch => {
    const promise = nextUrl ? pixiv.requestUrl(nextUrl) : pixiv.illustRecommendedPublic(options);
    const params = qs.parse(nextUrl);
    const offset = params.offset || "0";
    dispatch(requestRecommended(offset));
    return promise
      .then(json => dispatch(receiveRecommended(json, offset)))
      .catch(err => {
        dispatch(stopRecommended());
        dispatch(addError(err));
      });
  };
}

export function fetchRecommendedIllusts(options, nextUrl) {
  return (dispatch, getState) => {
    if (shouldFetchRecommended(getState())) {
      return dispatch(fetchRecommendedFromApi(options, nextUrl));
    }
  };
}

export function fetchRecommendedIllustsPublic(options, nextUrl) {
  return (dispatch, getState) => {
    if (shouldFetchRecommended(getState())) {
      return dispatch(fetchRecommendedPublicFromApi(options, nextUrl));
    }
  };
}

export function clearRecommendedIllusts(){
  return {
    type: CLEAR_RECOMMENDED_ILLUSTS
  };
}