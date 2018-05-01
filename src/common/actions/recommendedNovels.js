import qs from 'qs';
import { RECOMMENDED_NOVELS } from '../constants/actionTypes';

export function fetchRecommendedNovelsSuccess(entities, items, nextUrl) {
  return {
    type: RECOMMENDED_NOVELS.SUCCESS,
    payload: {
      entities,
      items,
      nextUrl,
      timestamp: Date.now(),
    },
  };
}

export function fetchRecommendedNovelsFailure() {
  return {
    type: RECOMMENDED_NOVELS.FAILURE,
  };
}

export function fetchRecommendedNovels(options, nextUrl, refreshing = false) {
  const params = qs.parse(nextUrl);
  const offset = params.offset || '0';
  return {
    type: RECOMMENDED_NOVELS.REQUEST,
    payload: {
      options,
      offset,
      nextUrl,
      refreshing,
    },
  };
}

export function clearRecommendedNovels() {
  return {
    type: RECOMMENDED_NOVELS.CLEAR,
  };
}
