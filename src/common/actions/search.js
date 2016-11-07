//import { createAction } from 'redux-actions';
import qs from "qs";
import { addError } from './error';
import pixiv from '../helpers/ApiClient';

export const REQUEST_SEARCH = 'REQUEST_SEARCH';
export const RECEIVE_SEARCH = 'RECEIVE_SEARCH';
export const STOP_SEARCH = 'STOP_SEARCH';
export const CLEAR_SEARCH = 'CLEAR_SEARCH';

function receiveSearch(json, word, options, offset) { 
  return {
    type: RECEIVE_SEARCH,
    payload: {
      items: json.illusts,
      nextUrl: json.next_url,
      word,
      offset,
      receivedAt: Date.now(),
    }
  };
}

function requestSearch(word, options, offset) {
  return {
    type: REQUEST_SEARCH,
    payload: {
      word,
      options,
      offset
    }
  };
}

function stopSearch(word, options, offset){
  return {
    type: STOP_SEARCH,
    payload: {
      word,
      options,
      offset
    }
  };
}

function shouldFetchSearch(state, word) {
  if (!word) {
    return false;
  }
  const results = state.search[word];
  if (results && results.loading) {
    return false;
  } else {
    return true;
  }
}

function fetchSearchFromApi(word, options, nextUrl) {
  return dispatch => {
    const promise = nextUrl ? pixiv.requestUrl(nextUrl) : pixiv.searchIllust(word, options);
    const params = qs.parse(nextUrl);
    const offset = params.offset || "0";
    dispatch(requestSearch(word, options, offset));
    return promise
      .then(json => dispatch(receiveSearch(json, word, options, offset)))
      .catch(err => {
        dispatch(stopSearch(word, options, offset));
        dispatch(addError(err));
      });
  };
}

export function fetchSearch(word, options, nextUrl) {
  return (dispatch, getState) => {
    if (shouldFetchSearch(getState(), word)) {
      return dispatch(fetchSearchFromApi(word, options, nextUrl));
    }
  };
}

export function clearSearch(word, options){
  return {
    type: CLEAR_SEARCH,
    payload: {
      word,
      options
    }
  };
}