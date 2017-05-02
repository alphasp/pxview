import qs from 'qs';
import { SEARCH_USERS } from '../constants/actionTypes';

export function fetchSearchUsersSuccess(entities, items, navigationStateKey, nextUrl) {
  return {
    type: SEARCH_USERS.SUCCESS,
    payload: {
      navigationStateKey,
      entities,
      items,
      nextUrl,
      timestamp: Date.now(),
    },
  };
}

export function fetchSearchUsersFailure(navigationStateKey) {
  return {
    type: SEARCH_USERS.FAILURE,
    payload: {
      navigationStateKey,
    },
  };
}

export function fetchSearchUsers(navigationStateKey, word, nextUrl, refreshing = false) {
  const params = qs.parse(nextUrl);
  const offset = params.offset || '0';
  return {
    type: SEARCH_USERS.REQUEST,
    payload: {
      navigationStateKey,
      word,
      offset,
      nextUrl,
      refreshing,
    },
  };
}

export function clearSearchUsers(navigationStateKey) {
  return {
    type: SEARCH_USERS.CLEAR,
    payload: {
      navigationStateKey,
    },
  };
}

export function clearAllSearchUsers() {
  return {
    type: SEARCH_USERS.CLEAR_ALL,
  };
}
