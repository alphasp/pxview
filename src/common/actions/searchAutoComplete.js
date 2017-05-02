import qs from 'qs';
import { SEARCH_AUTOCOMPLETE } from '../constants/actionTypes';

export function fetchSearchAutoCompleteSuccess(items) {
  return {
    type: SEARCH_AUTOCOMPLETE.SUCCESS,
    payload: {
      items,
      timestamp: Date.now(),
    },
  };
}

export function fetchSearchAutoCompleteFailure() {
  return {
    type: SEARCH_AUTOCOMPLETE.FAILURE,
  };
}

export function fetchSearchAutoComplete(word) {
  return {
    type: SEARCH_AUTOCOMPLETE.REQUEST,
    payload: {
      word,
    },
  };
}

export function clearSearchAutoComplete() {
  return {
    type: SEARCH_AUTOCOMPLETE.CLEAR,
  };
}
