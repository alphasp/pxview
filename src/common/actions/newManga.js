//import { createAction } from 'redux-actions';
import qs from "qs";
import { addError } from './error';
import pixiv from '../helpers/ApiClient';

export const REQUEST_NEW_MANGAS = 'REQUEST_NEW_MANGAS';
export const RECEIVE_NEW_MANGAS = 'RECEIVE_NEW_MANGAS';
export const STOP_NEW_MANGAS = 'STOP_NEW_MANGAS';
export const CLEAR_NEW_MANGAS = 'CLEAR_NEW_MANGAS';

function receiveNewMangas(json, offset) {
  return {
    type: RECEIVE_NEW_MANGAS,
    payload: {
      items: json.illusts,
      nextUrl: json.next_url,
      offset,
      timestamp: Date.now(),
    }
  };
}

function requestNewMangas(offset) {
  return {
    type: REQUEST_NEW_MANGAS,
    payload: {
      offset
    }
  };
}

function stopNewMangas() {
  return {
    type: STOP_NEW_MANGAS
  };
}

function shouldFetchNewMangas(state) {
  const results = state.newManga;
  if (results && results.loading) {
    return false;
  } else {
    return true;
  }
}

function fetchNewMangasFromApi(options, nextUrl) {
  return dispatch => {
    const promise = nextUrl ? pixiv.requestUrl(nextUrl) : pixiv.mangaNew(options);
    const params = qs.parse(nextUrl);
    const offset = params.offset || "0";
    dispatch(requestNewMangas(offset));
    return promise
      .then(json => dispatch(receiveNewMangas(json, offset)))
      .catch(err => {
        dispatch(stopNewMangas());
        dispatch(addError(err));
      });
  };
}

export function fetchNewMangas(options, nextUrl) {
  return (dispatch, getState) => {
    if (shouldFetchNewMangas(getState())) {
      return dispatch(fetchNewMangasFromApi(options, nextUrl));
    }
  };
}

export function clearNewMangas() {
  return {
    type: CLEAR_NEW_MANGAS
  };
}
