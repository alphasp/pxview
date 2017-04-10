import qs from "qs";
import { addError } from './error';
import pixiv from '../helpers/ApiClient';

export const FETCH_MY_PIXIV_ILLUSTS_REQUEST = 'FETCH_MY_PIXIV_ILLUSTS_REQUEST';
export const FETCH_MY_PIXIV_ILLUSTS_SUCCESS = 'FETCH_MY_PIXIV_ILLUSTS_SUCCESS';
export const FETCH_MY_PIXIV_ILLUSTS_FAILURE = 'FETCH_MY_PIXIV_ILLUSTS_FAILURE';
export const CLEAR_MY_PIXIV_ILLUSTS = 'CLEAR_MY_PIXIV_ILLUSTS';

function fetchMyPixivIllustsRequest(offset) {
  return {
    type: FETCH_MY_PIXIV_ILLUSTS_REQUEST,
    payload: {
      offset
    }
  };
}

function fetchMyPixivIllustsSuccess(json, offset) { 
  return {
    type: FETCH_MY_PIXIV_ILLUSTS_SUCCESS,
    payload: {
      items: json.illusts,
      nextUrl: json.next_url,
      offset,
      timestamp: Date.now(),
    }
  };
}

function fetchMyPixivIllustsFailure() {
  return {
    type: FETCH_MY_PIXIV_ILLUSTS_FAILURE,
  };
}

function shouldFetchMyPixivIllusts(state) {
  const results = state.myPixivIllust;
  if (results && results.loading) {
    return false;
  } 
  else {
    return true;
  }
}

function fetchMyPixivIllustsFromApi(nextUrl) {
  return dispatch => {
    const promise = nextUrl ? pixiv.requestUrl(nextUrl) : pixiv.illustMyPixiv();
    const params = qs.parse(nextUrl);
    const offset = params.offset || "0";
    dispatch(fetchMyPixivIllustsRequest(offset));
    return promise
      .then(json => dispatch(fetchMyPixivIllustsSuccess(json, offset)))
      .catch(err => {
        dispatch(fetchMyPixivIllustsFailure());
        dispatch(addError(err));
      });
  };
}

export function fetchMyPixivIllusts(nextUrl) {
  return (dispatch, getState) => {
    if (shouldFetchMyPixivIllusts(getState())) {
      return dispatch(fetchMyPixivIllustsFromApi(nextUrl));
    }
  };
}

export function clearMyPixivIllusts() {
  return {
    type: CLEAR_MY_PIXIV_ILLUSTS,
  };
}
