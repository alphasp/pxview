import qs from "qs";
import { addError } from './error';
import pixiv from '../helpers/ApiClient';

export const REQUEST_SEARCH = 'REQUEST_SEARCH';
export const RECEIVE_SEARCH = 'RECEIVE_SEARCH';
export const STOP_SEARCH = 'STOP_SEARCH';
export const CLEAR_SEARCH = 'CLEAR_SEARCH';
export const CLEAR_ALL_SEARCH = 'CLEAR_ALL_SEARCH';
export const SortType = {
  ASC: 'ASC',
  DESC: 'DESC',
};

function receiveSearch(json, word, options, sortType, offset) { 
  return {
    type: RECEIVE_SEARCH,
    payload: {
      items: json.illusts,
      nextUrl: json.next_url,
      word,
      offset,
      sortType: sortType,
      receivedAt: Date.now(),
    }
  };
}

function requestSearch(word, options, sortType, offset) {
  return {
    type: REQUEST_SEARCH,
    payload: {
      word,
      options,
      sortType,
      offset,
    }
  };
}

function stopSearch(word, options, sortType, offset){
  return {
    type: STOP_SEARCH,
    payload: {
      word,
      options,
      sortType,
      offset,
    }
  };
}

function shouldFetchSearch(searchState, word) {
  if (!word) {
    return false;
  }
  const results = searchState[word];
  if (results && results.loading) {
    return false;
  } 
  else {
    return true;
  }
}

function fetchSearchFromApi(word, options = {}, sortType, nextUrl) {
  return dispatch => {
    if (sortType === SortType.ASC) {
      options = {
        ...options,
        sort: 'date_asc'
      }
    }
    const promise = nextUrl ? pixiv.requestUrl(nextUrl) : pixiv.searchIllust(word, options);
    const params = qs.parse(nextUrl);
    const offset = params.offset || "0";
    dispatch(requestSearch(word, options, sortType, offset));
    return promise
      .then(json => dispatch(receiveSearch(json, word, options, sortType, offset)))
      .catch(err => {
        dispatch(stopSearch(word, options, sortType, offset));
        dispatch(addError(err));
      });
  };
}

export function fetchSearch(word, options, sortType, nextUrl, searchState) {
  word = word.trim();
  return (dispatch, getState) => {
    if (shouldFetchSearch(searchState, word)) {
      return dispatch(fetchSearchFromApi(word, options, sortType, nextUrl));
    }
  };
}

export function clearSearch(word, options, sortType){
  return {
    type: CLEAR_SEARCH,
    payload: {
      word,
      options,
      sortType
    }
  };
}

export function clearAllSearch(sortType){
  return {
    type: CLEAR_ALL_SEARCH,
    payload: {
      sortType
    }
  };
}