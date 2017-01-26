import qs from "qs";
import { addError } from './error';
import pixiv from '../helpers/ApiClient';

export const FETCH_ILLUST_BOOKMARK_DETAIL_REQUEST = 'FETCH_ILLUST_BOOKMARK_DETAIL_REQUEST';
export const FETCH_ILLUST_BOOKMARK_DETAIL_SUCCESS = 'FETCH_ILLUST_BOOKMARK_DETAIL_SUCCESS';
export const FETCH_ILLUST_BOOKMARK_DETAIL_FAILURE = 'FETCH_ILLUST_BOOKMARK_DETAIL_FAILURE';
export const CLEAR_ILLUST_BOOKMARK_DETAIL = 'CLEAR_ILLUST_BOOKMARK_DETAIL';

function fetchIllustBookmarkDetailRequest(illustId) {
  return {
    type: FETCH_ILLUST_BOOKMARK_DETAIL_REQUEST,
    payload: {
      illustId
    }
  };
}

function fetchIllustBookmarkDetailSuccess(json, illustId) { 
  return {
    type: FETCH_ILLUST_BOOKMARK_DETAIL_SUCCESS,
    payload: {
      item: json.bookmark_detail,
      illustId,
      receivedAt: Date.now(),
    }
  };
}

function fetchIllustBookmarkDetailFailure(illustId) {
  return {
    type: FETCH_ILLUST_BOOKMARK_DETAIL_FAILURE,
    payload: {
      illustId,
    }
  };
}

function shouldFetchIllustBookmarkDetail(state) {
  const results = state.illustBookmarkDetail;
  if (results && results.loading) {
    return false;
  } 
  else {
    return true;
  }
}

function fetchIllustBookmarkDetailFromApi(illustId) {
  return dispatch => {
    dispatch(fetchIllustBookmarkDetailRequest(illustId));
    return pixiv.illustBookmarkDetail(illustId)
      .then(json => dispatch(fetchIllustBookmarkDetailSuccess(json, illustId)))
      .catch(err => {
        dispatch(fetchIllustBookmarkDetailFailure(illustId));
        dispatch(addError(err));
      });
  };
}

export function fetchIllustBookmarkDetail(illustId) {
  return (dispatch, getState) => {
    if (shouldFetchIllustBookmarkDetail(getState(), illustId)) {
      return dispatch(fetchIllustBookmarkDetailFromApi(illustId));
    }
  };
}

export function clearIllustBookmarkDetail(illustId) {
  return {
    type: CLEAR_ILLUST_BOOKMARK_DETAIL,
    payload: {
      illustId
    }
  };
}
