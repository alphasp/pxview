import { TRENDING_NOVEL_TAGS } from '../constants/actionTypes';

export function fetchTrendingNovelTagsSuccess(entities, items) {
  return {
    type: TRENDING_NOVEL_TAGS.SUCCESS,
    payload: {
      entities,
      items,
      timestamp: Date.now(),
    },
  };
}

export function fetchTrendingNovelTagsFailure() {
  return {
    type: TRENDING_NOVEL_TAGS.FAILURE,
  };
}

export function fetchTrendingNovelTags(options, refreshing = false) {
  return {
    type: TRENDING_NOVEL_TAGS.REQUEST,
    payload: {
      options,
      refreshing,
    },
  };
}

export function clearTrendingNovelTags() {
  return {
    type: TRENDING_NOVEL_TAGS.CLEAR,
  };
}
