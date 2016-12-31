import qs from "qs";
import { addError } from './error';
import pixiv from '../helpers/ApiClient';

export const REQUEST_MY_PRIVATE_BOOKMARK_ILLUSTS = 'REQUEST_MY_PRIVATE_BOOKMARK_ILLUSTS';
export const RECEIVE_MY_PRIVATE_BOOKMARK_ILLUSTS = 'RECEIVE_MY_PRIVATE_BOOKMARK_ILLUSTS';
export const STOP_MY_PRIVATE_BOOKMARK_ILLUSTS = 'STOP_MY_PRIVATE_BOOKMARK_ILLUSTS';
export const CLEAR_MY_PRIVATE_BOOKMARK_ILLUSTS = 'CLEAR_MY_PRIVATE_BOOKMARK_ILLUSTS';

function receiveMyPrivateBookmarkIllust(json, userId, offset) { 
  return {
    type: RECEIVE_MY_PRIVATE_BOOKMARK_ILLUSTS,
    payload: {
      items: json.illusts,
      nextUrl: json.next_url,
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

function fetchMyPrivateBookmarkIllustFromApi(userId, nextUrl) {
  return dispatch => {
    const promise = nextUrl ? pixiv.requestUrl(nextUrl) : pixiv.userBookmarksIllust(userId, { restrict: 'private' } );
    const params = qs.parse(nextUrl);
    const offset = params.offset || "0";
    dispatch(requestMyPrivateBookmarkIllust(userId, offset));
    return promise
      .then(json => dispatch(receiveMyPrivateBookmarkIllust(json, userId, offset)))
      .catch(err => {
        dispatch(stopMyPrivateBookmarkIllust(userId));
        dispatch(addError(err));
      });
  };
}

export function fetchMyPrivateBookmarkIllusts(userId, nextUrl) {
  return (dispatch, getState) => {
    if (shouldFetchMyPrivateBookmarkIllust(getState()), userId) {
      return dispatch(fetchMyPrivateBookmarkIllustFromApi(userId, nextUrl));
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
