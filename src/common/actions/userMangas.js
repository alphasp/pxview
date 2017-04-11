import qs from "qs";
import { normalize } from 'normalizr';
import { addError } from './error';
import Schemas from '../constants/schemas';
import pixiv from '../helpers/ApiClient';

export const REQUEST_USER_MANGAS = 'REQUEST_USER_MANGAS';
export const RECEIVE_USER_MANGAS = 'RECEIVE_USER_MANGAS';
export const STOP_USER_MANGAS = 'STOP_USER_MANGAS';
export const CLEAR_USER_MANGAS = 'CLEAR_USER_MANGAS';
export const CLEAR_ALL_USER_MANGAS = 'CLEAR_ALL_USER_MANGAS';

function receiveUserMangas(normalized, nextUrl, userId, offset) { 
  return {
    type: RECEIVE_USER_MANGAS,
    payload: {
      entities: normalized.entities,
      items: normalized.result,
      nextUrl,
      userId,
      offset,
      timestamp: Date.now(),
    }
  };
}

function requestUserMangas(userId, offset) {
  return {
    type: REQUEST_USER_MANGAS,
    payload: {
      userId,
      offset
    }
  };
}

function stopUserMangas(userId){
  return {
    type: STOP_USER_MANGAS,
    payload: {
      userId
    }
  };
}

function shouldFetchUserMangas(state, userId) {
  if (!userId) {
    return false;
  }
  const results = state.userMangas[userId];
  if (results && results.loading) {
    return false;
  } 
  else {
    return true;
  }
}

function fetchUserMangasFromApi(userId, nextUrl) {
  return dispatch => {
    const promise = nextUrl ? pixiv.requestUrl(nextUrl) : pixiv.userIllusts(userId, { type: 'manga' });
    const params = qs.parse(nextUrl);
    const offset = params.offset || "0";
    dispatch(requestUserMangas(userId, offset));
    return promise
      .then(json => {
        const normalized = normalize(json.illusts, Schemas.ILLUST_ARRAY);
        dispatch(receiveUserMangas(normalized, json.next_url, userId, offset));
      })
      .catch(err => {
        dispatch(stopUserMangas(userId));
        dispatch(addError(err));
      });
  };
}

export function fetchUserMangas(userId, nextUrl) {
  return (dispatch, getState) => {
    if (shouldFetchUserMangas(getState(), userId)) {
      return dispatch(fetchUserMangasFromApi(userId, nextUrl));
    }
  };
}

export function clearUserMangas(userId) {
  return {
    type: CLEAR_USER_MANGAS,
    payload: {
      userId,
    }
  };
}

export function clearAllUserMangas() {
  return {
    type: CLEAR_ALL_USER_MANGAS,
  };
}