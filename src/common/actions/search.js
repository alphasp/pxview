import qs from "qs";
import { normalize } from 'normalizr';
import { addError } from './error';
import pixiv from '../helpers/ApiClient';
import Schemas from '../constants/schemas';
import { addSearchHistory } from './searchHistory';

export const REQUEST_SEARCH = 'REQUEST_SEARCH';
export const RECEIVE_SEARCH = 'RECEIVE_SEARCH';
export const STOP_SEARCH = 'STOP_SEARCH';
export const CLEAR_SEARCH = 'CLEAR_SEARCH';
export const CLEAR_ALL_SEARCH = 'CLEAR_ALL_SEARCH';
export const SortType = {
  ASC: 'ASC',
  DESC: 'DESC',
};

function receiveSearch(normalized, nextUrl, navigationStateKey, word, options, offset) { 
  return {
    type: RECEIVE_SEARCH,
    payload: {
      entities: normalized.entities,
      items: normalized.result,
      nextUrl,
      navigationStateKey,
      word,
      options,
      offset,
      receivedAt: Date.now(),
    }
  };
}

function requestSearch(navigationStateKey, word, options, offset) {
  return {
    type: REQUEST_SEARCH,
    payload: {
      navigationStateKey,
      word,
      options,
      offset,
    }
  };
}

function stopSearch(navigationStateKey, word, options, offset){
  return {
    type: STOP_SEARCH,
    payload: {
      word,
      options,
      offset,
    }
  };
}

function shouldFetchSearch(searchState) {
  if (searchState && searchState.loading) {
    return false;
  } 
  else {
    return true;
  }
}

function fetchSearchFromApi(navigationStateKey, word, options = {}, nextUrl) {
  if (options) {
    options = Object.keys(options)
      .filter(key => options[key])
      .reduce((prev, key) => {
        prev[key] = options[key];
        return prev;
      }, {});
  }
  return dispatch => {
    const promise = nextUrl ? pixiv.requestUrl(nextUrl) : pixiv.searchIllust(word, options);
    const params = qs.parse(nextUrl);
    const offset = params.offset || "0";
    dispatch(requestSearch(navigationStateKey, word, options, offset));
    return promise
      .then(json => {
        const normalized = normalize(json.illusts, Schemas.ILLUST_ARRAY);
        dispatch(receiveSearch(normalized, json.next_url, navigationStateKey, word, options, offset));
        // dispatch(receiveSearch(json, navigationStateKey, word, options, offset))
      })
      .catch(err => {
        dispatch(stopSearch(navigationStateKey, word, options, offset));
        dispatch(addError(err));
      });
  };
}

export function fetchSearch(navigationStateKey, word, options, nextUrl, searchState) {
  word = word.trim();
  return (dispatch, getState) => {
    if (shouldFetchSearch(searchState)) {
      dispatch(addSearchHistory(word));
      return dispatch(fetchSearchFromApi(navigationStateKey, word, options, nextUrl));
    }
  };
}

export function clearSearch(navigationStateKey){
  return {
    type: CLEAR_SEARCH,
    payload: {
      navigationStateKey,
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