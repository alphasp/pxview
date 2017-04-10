import qs from "qs";
import { normalize } from 'normalizr';
import { addError } from './error';
import pixiv from '../helpers/ApiClient';
import Schemas from '../constants/schemas';

export const REQUEST_RECOMMENDED_USERS = 'REQUEST_RECOMMENDED_USERS';
export const RECEIVE_RECOMMENDED_USERS = 'RECEIVE_RECOMMENDED_USERS';
export const STOP_RECOMMENDED_USERS = 'STOP_RECOMMENDED_USERS';
export const CLEAR_RECOMMENDED_USERS = 'CLEAR_RECOMMENDED_USERS';


function receiveRecommended(normalized, nextUrl, offset) { 
  return {
    type: RECEIVE_RECOMMENDED_USERS,
    payload: {
      entities: normalized.entities,
      items: normalized.result,
      nextUrl,
      offset,
      timestamp: Date.now(),
    }
  };
}

function requestRecommended(offset) {
  return {
    type: REQUEST_RECOMMENDED_USERS,
    payload: {
      offset
    }
  };
}

function stopRecommended(){
  return {
    type: STOP_RECOMMENDED_USERS
  };
}

function shouldFetchRecommended(state) {
  const results = state.recommendedUser;
  if (results && results.loading) {
    return false;
  } else {
    return true;
  }
}

function fetchRecommendedFromApi(options, nextUrl) {
  return dispatch => {
    const promise = nextUrl ? pixiv.requestUrl(nextUrl) : pixiv.userRecommended(options);
    const params = qs.parse(nextUrl);
    const offset = params.offset || "0";
    dispatch(requestRecommended(offset));
    return promise
      .then(json => {
        const filteredResult = {
          ...json,
          user_previews: json.user_previews.filter(result => {
            return result.illusts && result.illusts.length;
          }).map(result => {
            return {
              ...result,
              id: result.user.id
            }
          })
        };
        const normalized = normalize(filteredResult.user_previews, Schemas.USER_PREVIEW_ARRAY);
        dispatch(receiveRecommended(normalized, json.next_url, offset));
      })
      .catch(err => {
        dispatch(stopRecommended());
        dispatch(addError(err));
      });
  };
}

export function fetchRecommendedUsers(options, nextUrl) {
  return (dispatch, getState) => {
    if (shouldFetchRecommended(getState())) {
      return dispatch(fetchRecommendedFromApi(options, nextUrl));
    }
  };
}

export function clearRecommendedUsers(){
  return {
    type: CLEAR_RECOMMENDED_USERS
  };
}