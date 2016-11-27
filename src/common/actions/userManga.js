import qs from "qs";
import { addError } from './error';
import pixiv from '../helpers/ApiClient';

export const REQUEST_USER_MANGAS = 'REQUEST_USER_MANGAS';
export const RECEIVE_USER_MANGAS = 'RECEIVE_USER_MANGAS';
export const STOP_USER_MANGAS = 'STOP_USER_MANGAS';
export const CLEAR_USER_MANGAS = 'CLEAR_USER_MANGAS';
export const CLEAR_ALL_USER_MANGAS = 'CLEAR_ALL_USER_MANGAS';

function receiveUserManga(json, userId, offset) { 
  return {
    type: RECEIVE_USER_MANGAS,
    payload: {
      items: json.illusts,
      nextUrl: json.next_url,
      userId,
      offset,
      receivedAt: Date.now(),
    }
  };
}

function requestUserManga(userId, offset) {
  return {
    type: REQUEST_USER_MANGAS,
    payload: {
      userId,
      offset
    }
  };
}

function stopUserManga(userId){
  return {
    type: STOP_USER_MANGAS,
    payload: {
      userId
    }
  };
}

function shouldFetchUserManga(state, userId) {
  if (!userId) {
    return false;
  }
  const results = state.userManga[userId];
  if (results && results.loading) {
    return false;
  } 
  else {
    return true;
  }
}

function fetchUserMangaFromApi(userId, nextUrl) {
  return dispatch => {
    const promise = nextUrl ? pixiv.requestUrl(nextUrl) : pixiv.userIllusts(userId, { type: 'manga' });
    const params = qs.parse(nextUrl);
    const offset = params.offset || "0";
    dispatch(requestUserManga(userId, offset));
    return promise
      .then(json => dispatch(receiveUserManga(json, userId, offset)))
      .catch(err => {
        dispatch(stopUserManga(userId));
        dispatch(addError(err));
      });
  };
}

export function fetchUserMangas(userId, nextUrl) {
  return (dispatch, getState) => {
    if (shouldFetchUserManga(getState()), userId) {
      return dispatch(fetchUserMangaFromApi(userId, nextUrl));
    }
  };
}

export function clearUserMangas(userId){
  return {
    type: CLEAR_USER_MANGAS,
    payload: {
      userId,
    }
  };
}

export function clearAllUserMangas(){
  return {
    type: CLEAR_ALL_USER_MANGAS,
  };
}