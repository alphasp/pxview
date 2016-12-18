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

function receiveSearch(json, navigationStateKey, word, options, sortType, offset) { 
  return {
    type: RECEIVE_SEARCH,
    payload: {
      items: json.illusts,
      nextUrl: json.next_url,
      navigationStateKey,
      word,
      options,
      offset,
      sortType,
      receivedAt: Date.now(),
    }
  };
}

function requestSearch(navigationStateKey, word, options, sortType, offset) {
  return {
    type: REQUEST_SEARCH,
    payload: {
      navigationStateKey,
      word,
      options,
      sortType,
      offset,
    }
  };
}

function stopSearch(navigationStateKey, word, options, sortType, offset){
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

function shouldFetchSearch(searchState, navigationStateKey) {
  if (!navigationStateKey) {
    return false;
  }
  const results = searchState[navigationStateKey];
  if (results && results.loading) {
    return false;
  } 
  else {
    return true;
  }
}

function fetchSearchFromApi(navigationStateKey, word, options = {}, sortType, nextUrl) {
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
    dispatch(requestSearch(navigationStateKey, word, options, sortType, offset));
    return promise
      .then(json => dispatch(receiveSearch(json, navigationStateKey, word, options, sortType, offset)))
      .catch(err => {
        dispatch(stopSearch(navigationStateKey, word, options, sortType, offset));
        dispatch(addError(err));
      });
  };
}

export function fetchSearch(navigationStateKey, word, options, sortType, nextUrl, searchState) {
  word = word.trim();
  return (dispatch, getState) => {
    if (shouldFetchSearch(searchState, navigationStateKey)) {
      return dispatch(fetchSearchFromApi(navigationStateKey, word, options, sortType, nextUrl));
    }
  };
}

export function clearSearch(navigationStateKey, sortType){
  return {
    type: CLEAR_SEARCH,
    payload: {
      navigationStateKey,
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