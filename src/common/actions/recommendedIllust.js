import qs from "qs";
import { normalize } from 'normalizr';
import { addError } from './error';
import pixiv from '../helpers/ApiClient';
import Schemas from '../constants/schemas';

export const REQUEST_RECOMMENDED_ILLUSTS = 'REQUEST_RECOMMENDED_ILLUSTS';
export const RECEIVE_RECOMMENDED_ILLUSTS = 'RECEIVE_RECOMMENDED_ILLUSTS';
export const STOP_RECOMMENDED_ILLUSTS = 'STOP_RECOMMENDED_ILLUSTS';
export const CLEAR_RECOMMENDED_ILLUSTS = 'CLEAR_RECOMMENDED_ILLUSTS';

function receiveRecommended(normalized, nextUrl, offset) { 
  return {
    type: RECEIVE_RECOMMENDED_ILLUSTS,
    payload: {
      entities: normalized.entities,
      items: normalized.result,
      nextUrl,
      offset,
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

//todo
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
      .then(json => {
        const normalized = normalize(json.illusts, Schemas.ILLUST_ARRAY);
        dispatch(receiveRecommended(normalized, json.next_url, offset));
      })
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