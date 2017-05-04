import qs from 'qs';
import { SEARCH } from '../constants/actionTypes';

export function fetchSearchSuccess(
  entities,
  items,
  navigationStateKey,
  nextUrl,
) {
  return {
    type: SEARCH.SUCCESS,
    payload: {
      navigationStateKey,
      entities,
      items,
      nextUrl,
      timestamp: Date.now(),
    },
  };
}

export function fetchSearchFailure(navigationStateKey) {
  return {
    type: SEARCH.FAILURE,
    payload: {
      navigationStateKey,
    },
  };
}

export function fetchSearch(
  navigationStateKey,
  word,
  options,
  nextUrl,
  refreshing = false,
) {
  const params = qs.parse(nextUrl);
  const offset = params.offset || '0';
  return {
    type: SEARCH.REQUEST,
    payload: {
      navigationStateKey,
      word,
      options,
      offset,
      nextUrl,
      refreshing,
    },
  };
}

export function clearSearch(navigationStateKey) {
  return {
    type: SEARCH.CLEAR,
    payload: {
      navigationStateKey,
    },
  };
}

export function clearAllSearch() {
  return {
    type: SEARCH.CLEAR_ALL,
  };
}
