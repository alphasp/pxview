import qs from "qs";
import { SEARCH_USERS } from '../constants/actionTypes';

export function fetchSearchUsersSuccess(entities, items, nextUrl) {
  return {
    type: SEARCH_USERS.SUCCESS,
    payload: {
      entities,
      items,
      nextUrl,
      timestamp: Date.now(),
    }
  };
}

export function fetchSearchUsersFailure() {
  return {
    type: SEARCH_USERS.FAILURE
  };
}

export function fetchSearchUsers(word, nextUrl, refreshing = false) {
  const params = qs.parse(nextUrl);
  const offset = params.offset || "0";
  return {
    type: SEARCH_USERS.REQUEST,
    payload: {
      word,
      offset,
      nextUrl,
      refreshing
    }
  };
}

export function clearSearchUsers() {
  return {
    type: SEARCH_USERS.CLEAR
  };
}