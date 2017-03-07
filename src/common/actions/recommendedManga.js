//import { createAction } from 'redux-actions';
import qs from "qs";
import { normalize } from 'normalizr';
import { addError } from './error';
import pixiv from '../helpers/ApiClient';
import Schemas from '../constants/schemas';

export const REQUEST_RECOMMENDED_MANGAS = 'REQUEST_RECOMMENDED_MANGAS';
export const RECEIVE_RECOMMENDED_MANGAS = 'RECEIVE_RECOMMENDED_MANGAS';
export const STOP_RECOMMENDED_MANGAS = 'STOP_RECOMMENDED_MANGAS';
export const CLEAR_RECOMMENDED_MANGAS = 'CLEAR_RECOMMENDED_MANGAS';

function receiveRecommended(normalized, nextUrl, offset) { 
  return {
    type: RECEIVE_RECOMMENDED_MANGAS,
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
    type: REQUEST_RECOMMENDED_MANGAS,
    payload: {
      offset
    }
  };
}

function stopRecommended() {
  return {
    type: STOP_RECOMMENDED_MANGAS
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

export function fetchRecommendedMangas(options, nextUrl) {
  return (dispatch, getState) => {
    if (shouldFetchRecommended(getState())) {
      return dispatch(fetchRecommendedFromApi(options, nextUrl));
    }
  };
}

export function clearRecommendedMangas() {
  return {
    type: CLEAR_RECOMMENDED_MANGAS
  };
}
