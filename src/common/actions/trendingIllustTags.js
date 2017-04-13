import qs from "qs";
import { TRENDING_ILLUST_TAGS } from '../constants/actionTypes';

export function fetchTrendingIllustTagsSuccess(entities, items) {
  return {
    type: TRENDING_ILLUST_TAGS.SUCCESS,
    payload: {
      entities,
      items,
      timestamp: Date.now(),
    }
  };
}

export function fetchTrendingIllustTagsFailure() {
  return {
    type: TRENDING_ILLUST_TAGS.FAILURE
  };
}

export function fetchTrendingIllustTags(options, refreshing = false) {
  return {
    type: TRENDING_ILLUST_TAGS.REQUEST,
    payload: {
      options,
      refreshing
    }
  };
}

export function clearTrendingIllustTags() {
  return {
    type: TRENDING_ILLUST_TAGS.CLEAR
  };
}