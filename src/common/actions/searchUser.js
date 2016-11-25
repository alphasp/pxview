import qs from "qs";
import { addError } from './error';
import pixiv from '../helpers/ApiClient';

export const REQUEST_SEARCH_USER = 'REQUEST_SEARCH_USER';
export const RECEIVE_SEARCH_USER = 'RECEIVE_SEARCH_USER';
export const RECEIVE_SEARCH_USER_CONCAT = 'RECEIVE_SEARCH_USER_CONCAT';
export const STOP_SEARCH_USER = 'STOP_SEARCH_USER';
export const CLEAR_SEARCH_USER = 'CLEAR_SEARCH_USER';

function receiveSearchUser(json, word, offset) { 
  return {
    type: RECEIVE_SEARCH_USER,
    payload: {
      items: json.user_previews,
      nextUrl: json.next_url,
      word,
      offset,
      receivedAt: Date.now(),
    }
  };
}

function receiveSearchUserConcat(json, word, offset) { 
  return {
    type: RECEIVE_SEARCH_USER_CONCAT,
    payload: {
      items: json.user_previews,
      nextUrl: json.next_url,
      word,
      offset,
      receivedAt: Date.now(),
    }
  };
}

function requestSearchUser(word, offset) {
  return {
    type: REQUEST_SEARCH_USER,
    payload: {
      word,
      offset
    }
  };
}

function stopSearchUser(word, offset){
  return {
    type: STOP_SEARCH_USER,
    payload: {
      word,
      offset
    }
  };
}

function shouldFetchSearchUser(state, word) {
  const results = state.searchUser;
  if (results && results.loading) {
    return false;
  } else {
    return true;
  }
}

function fetchSearchUserFromApi(word, nextUrl) {
  return dispatch => {
    const promise = nextUrl ? pixiv.requestUrl(nextUrl) : pixiv.searchUser(word);
    const params = qs.parse(nextUrl);
    const offset = params.offset || "0";
    dispatch(requestSearchUser(word, offset));
    return promise
      .then(json => {
        const filteredResult = {
          ...json,
          user_previews: json.user_previews.filter(user => {
            return user.illusts && user.illusts.length;
          })
        };
        if (nextUrl) {
          return dispatch(receiveSearchUserConcat(filteredResult, word, offset))
        }
        else {
          return dispatch(receiveSearchUser(filteredResult, word, offset))
        }
      })
      .catch(err => {
        dispatch(stopSearchUser(word, offset));
        dispatch(addError(err));
      });
  };
}

export function fetchSearchUser(word, nextUrl) {
  word = word.trim();
  return (dispatch, getState) => {
    if (shouldFetchSearchUser(getState(), word)) {
      return dispatch(fetchSearchUserFromApi(word, nextUrl));
    }
  };
}

export function clearSearchUser(){
  return {
    type: CLEAR_SEARCH_USER,
  };
}