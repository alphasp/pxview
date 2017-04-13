import qs from "qs";
import { addError } from './error';
import pixiv from '../helpers/ApiClient';

export const REQUEST_SEARCH_USER_AUTOCOMPLETE = 'REQUEST_SEARCH_USER_AUTOCOMPLETE';
export const RECEIVE_SEARCH_USER_AUTOCOMPLETE = 'RECEIVE_SEARCH_USER_AUTOCOMPLETE';
export const RECEIVE_SEARCH_USER_AUTOCOMPLETE_CONCAT = 'RECEIVE_SEARCH_USER_AUTOCOMPLETE_CONCAT';
export const STOP_SEARCH_USER_AUTOCOMPLETE = 'STOP_SEARCH_USER_AUTOCOMPLETE';
export const CLEAR_SEARCH_USER_AUTOCOMPLETE = 'CLEAR_SEARCH_USER_AUTOCOMPLETE';

function receiveSearchUserAutoComplete(json, word, offset) { 
  return {
    type: RECEIVE_SEARCH_USER_AUTOCOMPLETE,
    payload: {
      items: json.user_previews,
      nextUrl: json.next_url,
      word,
      offset,
      timestamp: Date.now(),
    }
  };
}

function receiveSearchUserAutoCompleteConcat(json, word, offset) { 
  return {
    type: RECEIVE_SEARCH_USER_AUTOCOMPLETE_CONCAT,
    payload: {
      items: json.user_previews,
      nextUrl: json.next_url,
      word,
      offset,
      timestamp: Date.now(),
    }
  };
}

function requestSearchUserAutoComplete(word, offset) {
  return {
    type: REQUEST_SEARCH_USER_AUTOCOMPLETE,
    payload: {
      word,
      offset
    }
  };
}

function stopSearchUserAutoComplete(word, offset){
  return {
    type: STOP_SEARCH_USER_AUTOCOMPLETE,
    payload: {
      word,
      offset
    }
  };
}

function shouldFetchSearchUserAutoComplete(state, word) {
  const results = state.searchUsersAutoComplete;
  if (results && results.loading) {
    return false;
  } else {
    return true;
  }
}

function fetchSearchUserAutoCompleteFromApi(word, nextUrl) {
  return dispatch => {
    const promise = nextUrl ? pixiv.requestUrl(nextUrl) : pixiv.searchUser(word);
    const params = qs.parse(nextUrl);
    const offset = params.offset || "0";
    dispatch(requestSearchUserAutoComplete(word, offset));
    return promise
      .then(json => {
        const filteredResult = {
          ...json,
          user_previews: json.user_previews.filter(user => {
            return user.illusts && user.illusts.length;
          })
        };
        if (nextUrl) {
          return dispatch(receiveSearchUserAutoCompleteConcat(filteredResult, word, offset))
        }
        else {
          return dispatch(receiveSearchUserAutoComplete(filteredResult, word, offset))
        }
      })
      .catch(err => {
        dispatch(stopSearchUserAutoComplete(word, offset));
        dispatch(addError(err));
      });
  };
}

export function fetchSearchUserAutoComplete(word, nextUrl) {
  word = word.trim();
  return (dispatch, getState) => {
    if (shouldFetchSearchUserAutoComplete(getState(), word)) {
      return dispatch(fetchSearchUserAutoCompleteFromApi(word, nextUrl));
    }
  };
}

export function clearSearchUserAutoComplete(){
  return {
    type: CLEAR_SEARCH_USER_AUTOCOMPLETE,
  };
}