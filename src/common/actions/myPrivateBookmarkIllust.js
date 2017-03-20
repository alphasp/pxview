import qs from "qs";
import { normalize } from 'normalizr';
import { addError } from './error';
import Schemas from '../constants/schemas';
import pixiv from '../helpers/ApiClient';

export const REQUEST_MY_PRIVATE_BOOKMARK_ILLUSTS = 'REQUEST_MY_PRIVATE_BOOKMARK_ILLUSTS';
export const RECEIVE_MY_PRIVATE_BOOKMARK_ILLUSTS = 'RECEIVE_MY_PRIVATE_BOOKMARK_ILLUSTS';
export const STOP_MY_PRIVATE_BOOKMARK_ILLUSTS = 'STOP_MY_PRIVATE_BOOKMARK_ILLUSTS';
export const CLEAR_MY_PRIVATE_BOOKMARK_ILLUSTS = 'CLEAR_MY_PRIVATE_BOOKMARK_ILLUSTS';

function receiveMyPrivateBookmarkIllust(normalized, nextUrl, userId, offset) { 
  return {
    type: RECEIVE_MY_PRIVATE_BOOKMARK_ILLUSTS,
    payload: {
      entities: normalized.entities,
      items: normalized.result,
      nextUrl,
      userId,
      offset,
      receivedAt: Date.now(),
    }
  };
}

function requestMyPrivateBookmarkIllust(userId, offset) {
  return {
    type: REQUEST_MY_PRIVATE_BOOKMARK_ILLUSTS,
    payload: {
      userId,
      offset
    }
  };
}

function stopMyPrivateBookmarkIllust(userId){
  return {
    type: STOP_MY_PRIVATE_BOOKMARK_ILLUSTS,
    payload: {
      userId
    }
  };
}

function shouldFetchMyPrivateBookmarkIllust(state, userId) {
  if (!userId) {
    return false;
  }
  const results = state.myPrivateBookmarkIllust[userId];
  if (results && results.loading) {
    return false;
  } 
  else {
    return true;
  }
}

function fetchMyPrivateBookmarkIllustFromApi(userId, tag, nextUrl) {
  return dispatch => {
    let options = {
      restrict: 'private'
    };
    if (tag) {
      options.tag = tag;
    }
    const promise = nextUrl ? pixiv.requestUrl(nextUrl) : pixiv.userBookmarksIllust(userId, options);
    const params = qs.parse(nextUrl);
    const offset = params.offset || "0";
    dispatch(requestMyPrivateBookmarkIllust(userId, offset));
    return promise
      .then(json => {
        const normalized = normalize(json.illusts, Schemas.ILLUST_ARRAY);
        dispatch(receiveMyPrivateBookmarkIllust(normalized, json.next_url, userId, offset));
      })
      .catch(err => {
        dispatch(stopMyPrivateBookmarkIllust(userId));
        dispatch(addError(err));
      });
  };
}

export function fetchMyPrivateBookmarkIllusts(userId, tag, nextUrl) {
  return (dispatch, getState) => {
    if (shouldFetchMyPrivateBookmarkIllust(getState(), userId)) {
      return dispatch(fetchMyPrivateBookmarkIllustFromApi(userId, tag, nextUrl));
    }
  };
}

export function clearMyPrivateBookmarkIllusts(userId){
  return {
    type: CLEAR_MY_PRIVATE_BOOKMARK_ILLUSTS,
    payload: {
      userId,
    }
  };
}
