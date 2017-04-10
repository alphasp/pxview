import qs from "qs";
import { addError } from './error';
import pixiv from '../helpers/ApiClient';

export const REQUEST_SEARCH_AUTOCOMPLETE = 'REQUEST_SEARCH_AUTOCOMPLETE';
export const RECEIVE_SEARCH_AUTOCOMPLETE = 'RECEIVE_SEARCH_AUTOCOMPLETE';
export const STOP_SEARCH_AUTOCOMPLETE = 'STOP_SEARCH_AUTOCOMPLETE_AUTOCOMPLETE';
export const CLEAR_SEARCH_AUTOCOMPLETE = 'CLEAR_SEARCH_AUTOCOMPLETE_AUTOCOMPLETE';

function receiveSearchAutoComplete(json, word) { 
  return {
    type: RECEIVE_SEARCH_AUTOCOMPLETE,
    payload: {
      items: json.search_auto_complete_keywords,
      nextUrl: json.next_url,
      word,
      timestamp: Date.now(),
    }
  };
}

function requestSearchAutoComplete(word) {
  return {
    type: REQUEST_SEARCH_AUTOCOMPLETE,
    payload: {
      word,
    }
  };
}

function stopSearchAutoComplete(word){
  return {
    type: STOP_SEARCH_AUTOCOMPLETE,
    payload: {
      word,
    }
  };
}

function shouldFetchSearchAutoComplete(state, word) {
  if (!word) {
    return false;
  }
  const results = state.searchAutoComplete;
  if (results && results.loading) {
    return false;
  } else {
    return true;
  }
}

function fetchSearchAutoCompleteFromApi(word) {
  return dispatch => {
    dispatch(requestSearchAutoComplete(word));
    return pixiv.searchAutoComplete(word)
      .then(json => dispatch(receiveSearchAutoComplete(json, word)))
      .catch(err => {
        dispatch(stopSearchAutoComplete(word));
        dispatch(addError(err));
      });
  };
}

export function fetchSearchAutoComplete(word) {
  word = word.trim();
  return (dispatch, getState) => {
    if (shouldFetchSearchAutoComplete(getState(), word)) {
      return dispatch(fetchSearchAutoCompleteFromApi(word));
    }
  };
}

export function clearSearchAutoComplete(){
  return {
    type: CLEAR_SEARCH_AUTOCOMPLETE,
  };
}