import qs from 'qs';
import { SEARCH_NOVELS } from '../constants/actionTypes';

export function fetchSearchNovelsSuccess(
  entities,
  items,
  navigationStateKey,
  nextUrl,
) {
  return {
    type: SEARCH_NOVELS.SUCCESS,
    payload: {
      navigationStateKey,
      entities,
      items,
      nextUrl,
      timestamp: Date.now(),
    },
  };
}

export function fetchSearchNovelsFailure(navigationStateKey) {
  return {
    type: SEARCH_NOVELS.FAILURE,
    payload: {
      navigationStateKey,
    },
  };
}

export function fetchSearchNovels(
  navigationStateKey,
  word,
  options,
  nextUrl,
  refreshing = false,
) {
  const params = qs.parse(nextUrl);
  const offset = params.offset || '0';
  return {
    type: SEARCH_NOVELS.REQUEST,
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

export function clearSearchNovels(navigationStateKey) {
  return {
    type: SEARCH_NOVELS.CLEAR,
    payload: {
      navigationStateKey,
    },
  };
}

export function clearAllSearchNovels() {
  return {
    type: SEARCH_NOVELS.CLEAR_ALL,
  };
}
