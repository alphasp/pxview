import qs from "qs";
import { SEARCH_USERS_AUTOCOMPLETE } from '../constants/actionTypes';

export function fetchSearchUsersAutoCompleteSuccess(entities, items, nextUrl) {
  return {
    type: SEARCH_USERS_AUTOCOMPLETE.SUCCESS,
    payload: {
      entities,
      items,
      nextUrl,
      timestamp: Date.now(),
    }
  };
}

export function fetchSearchUsersAutoCompleteFailure() {
  return {
    type: SEARCH_USERS_AUTOCOMPLETE.FAILURE
  };
}

export function fetchSearchUsersAutoComplete(word, nextUrl, refreshing = false) {
  const params = qs.parse(nextUrl);
  const offset = params.offset || "0";
  return {
    type: SEARCH_USERS_AUTOCOMPLETE.REQUEST,
    payload: {
      word,
      offset,
      nextUrl,
      refreshing
    }
  };
}

export function clearSearchUsersAutoComplete() {
  return {
    type: SEARCH_USERS_AUTOCOMPLETE.CLEAR
  };
}