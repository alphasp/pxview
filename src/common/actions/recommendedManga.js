//import { createAction } from 'redux-actions';
import qs from "qs";
import { addError } from './error';
import pixiv from '../helpers/ApiClient';

export const REQUEST_RECOMMENDED_MANGAS = 'REQUEST_RECOMMENDED_MANGAS';
export const RECEIVE_RECOMMENDED_MANGAS = 'RECEIVE_RECOMMENDED_MANGAS';
export const STOP_RECOMMENDED_MANGAS = 'STOP_RECOMMENDED_MANGAS';
export const CLEAR_RECOMMENDED_MANGAS = 'CLEAR_RECOMMENDED_MANGAS';

function receiveRecommended(json, offset) {
  return {
    type: RECEIVE_RECOMMENDED_MANGAS,
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
      .then(json => dispatch(receiveRecommended(json, offset)))
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
