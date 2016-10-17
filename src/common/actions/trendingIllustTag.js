//import { createAction } from 'redux-actions';
import qs from "qs";
import { addError } from './error';
import pixiv from '../helpers/ApiClient';

export const REQUEST_TRENDING_ILLUST_TAGS = 'REQUEST_TRENDING_ILLUST_TAGS';
export const RECEIVE_TRENDING_ILLUST_TAGS = 'RECEIVE_TRENDING_ILLUST_TAGS';
export const STOP_TRENDING_ILLUST_TAGS = 'STOP_TRENDING_ILLUST_TAGS';
export const CLEAR_TRENDING_ILLUST_TAGS = 'CLEAR_TRENDING_ILLUST_TAGS';

function receiveTrendingIllustTags(json, offset) { 
  return {
    type: RECEIVE_TRENDING_ILLUST_TAGS,
    payload: {
      items: json.trend_tags,
      receivedAt: Date.now(),
    }
  };
}

function requestTrendingIllustTags() {
  return {
    type: REQUEST_TRENDING_ILLUST_TAGS
  };
}

function stopTrendingIllustTags(){
  return {
    type: STOP_TRENDING_ILLUST_TAGS
  };
}

function shouldFetchTrendingIllustTags(state) {
  const results = state.trendingIllustTag;
  if (results && results.loading) {
    return false;
  } else {
    return true;
  }
}

function fetchTrendingIllustsFromApi(options) {
  return dispatch => {
    dispatch(requestTrendingIllustTags());
    return pixiv.trendingTagsIllust(options)
      .then(json => dispatch(receiveTrendingIllustTags(json)))
      .catch(err => {
        dispatch(stopTrendingIllustTags());
        dispatch(addError(err));
      });
  };
}

export function fetchTrendingIllustTags(options) {
  return (dispatch, getState) => {
    if (shouldFetchTrendingIllustTags(getState())) {
      return dispatch(fetchTrendingIllustsFromApi(options));
    }
  };
}

export function clearTrendingIllustTags() {
  return {
    type: CLEAR_TRENDING_ILLUST_TAGS
  };
}