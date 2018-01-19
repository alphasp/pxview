import qs from 'qs';
import { SEARCH_ILLUSTS } from '../constants/actionTypes';

export function fetchSearchIllustsSuccess(
  entities,
  items,
  navigationStateKey,
  nextUrl,
) {
  return {
    type: SEARCH_ILLUSTS.SUCCESS,
    payload: {
      navigationStateKey,
      entities,
      items,
      nextUrl,
      timestamp: Date.now(),
    },
  };
}

export function fetchSearchIllustsFailure(navigationStateKey) {
  return {
    type: SEARCH_ILLUSTS.FAILURE,
    payload: {
      navigationStateKey,
    },
  };
}

export function fetchSearchIllusts(
  navigationStateKey,
  word,
  options,
  nextUrl,
  refreshing = false,
) {
  const params = qs.parse(nextUrl);
  const offset = params.offset || '0';
  return {
    type: SEARCH_ILLUSTS.REQUEST,
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

export function clearSearchIllusts(navigationStateKey) {
  return {
    type: SEARCH_ILLUSTS.CLEAR,
    payload: {
      navigationStateKey,
    },
  };
}

export function clearAllSearchIllusts() {
  return {
    type: SEARCH_ILLUSTS.CLEAR_ALL,
  };
}
