import qs from "qs";
import { normalize } from 'normalizr';
import { addError } from './error';
import Schemas from '../constants/schemas';
import pixiv from '../helpers/ApiClient';

export const FETCH_USER_FOLLOWING_REQUEST = 'FETCH_USER_FOLLOWING_REQUEST';
export const FETCH_USER_FOLLOWING_SUCCESS = 'FETCH_USER_FOLLOWING_SUCCESS';
export const FETCH_USER_FOLLOWING_FAILURE = 'FETCH_USER_FOLLOWING_FAILURE';
export const CLEAR_USER_FOLLOWING = 'CLEAR_USER_FOLLOWING';
export const CLEAR_ALL_USER_FOLLOWING = 'CLEAR_ALL_USER_FOLLOWING';

export const FollowingType = {
  PUBLIC: 'PUBLIC',
  PRIVATE: 'PRIVATE',
};

function fetchUserFollowingRequest(userId, followingType, offset) {
  return {
    type: FETCH_USER_FOLLOWING_REQUEST,
    payload: {
      userId,
      followingType,
      offset
    }
  };
}

function fetchUserFollowingSuccess(normalized, nextUrl, userId, followingType, offset) { 
  return {
    type: FETCH_USER_FOLLOWING_SUCCESS,
    payload: {
      entities: normalized.entities,
      items: normalized.result,
      nextUrl,
      userId,
      followingType,
      offset,
      receivedAt: Date.now(),
    }
  };
}

function fetchUserFollowingFailure(userId, followingType) {
  return {
    type: FETCH_USER_FOLLOWING_FAILURE,
    payload: {
      userId,
      followingType
    }
  };
}

function shouldFetchUserFollowing(state, userId, followingType) {
  //todo
  const results = state.userFollowing[followingType][userId];
  if (results && results.loading) {
    return false;
  } 
  else {
    return true;
  }
}

function fetchUserFollowingFromApi(userId, followingType, nextUrl) {
  const options = {
    restrict: followingType === FollowingType.PRIVATE ? 'private' : 'public'
  }
  return dispatch => {
    const promise = nextUrl ? pixiv.requestUrl(nextUrl) : pixiv.userFollowing(userId, options);
    const params = qs.parse(nextUrl);
    const offset = params.offset || "0";
    dispatch(fetchUserFollowingRequest(userId, followingType, offset));
    return promise
      .then(json => {
        const mappedResult = {
          ...json,
          user_previews: json.user_previews.map(result => {
            return {
              ...result,
              id: result.user.id
            }
          })
        };
        const normalized = normalize(mappedResult.user_previews, Schemas.USER_PREVIEW_ARRAY);
        dispatch(fetchUserFollowingSuccess(normalized, json.next_url, userId, followingType, offset));
      })
      .catch(err => {
        dispatch(fetchUserFollowingFailure(userId, followingType));
        dispatch(addError(err));
      });
  };
}

export function fetchUserFollowing(userId, followingType, nextUrl) {
  return (dispatch, getState) => {
    if (shouldFetchUserFollowing(getState(), userId, followingType)) {
      return dispatch(fetchUserFollowingFromApi(userId, followingType, nextUrl));
    }
  };
}

export function clearUserFollowing(userId, followingType) {
  return {
    type: CLEAR_USER_FOLLOWING,
    payload: {
      userId,
      followingType
    }
  };
}

export function clearAllUserFollowing() {
  return {
    type: CLEAR_ALL_USER_FOLLOWING,
  };
}

