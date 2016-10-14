//import { createAction } from 'redux-actions';
import qs from "qs";
import { addError } from './error';
import pixiv from '../helpers/ApiClient';

export const REQUEST_RECOMENDED_MANGA = 'REQUEST_RECOMENDED_MANGA';
export const RECEIVE_RECOMENDED_MANGA = 'RECEIVE_RECOMENDED_MANGA';
export const STOP_RECOMENDED_MANGA = 'STOP_RECOMENDED_MANGA';
export const CLEAR_RECOMENDED_MANGA = 'CLEAR_RECOMENDED_MANGA';

function receiveRecommended(json, offset) { 
  return {
    type: RECEIVE_RECOMENDED_MANGA,
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
    type: REQUEST_RECOMENDED_MANGA,
    payload: {
      offset
    }
  };
}

function stopRecommended(){
  return {
    type: STOP_RECOMENDED_MANGA
  };
}

function shouldFetchRecommended(state) {
  const results = state.recommendedManga;
  if (results && results.loading) {
    return false;
  } else {
    return true;
  }
}

function fetchRecommendedFromApi(options, nextUrl) {
  return dispatch => {
    const promise = nextUrl ? pixiv.requestUrl(nextUrl) : pixiv.mangaRecommended(options);
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

export function fetchRecommendedManga(options) {
  return (dispatch, getState) => {
    if (shouldFetchRecommended(getState())) {
      return dispatch(fetchRecommendedFromApi());
    }
  };
}

export function clearRecommended(){
  return {
    type: CLEAR_RECOMENDED_MANGA
  };
}
