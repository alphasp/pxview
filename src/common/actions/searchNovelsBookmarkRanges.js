import { SEARCH_NOVELS_BOOKMARK_RANGES } from '../constants/actionTypes';

export function fetchSearchNovelsBookmarkRangesSuccess(
  items,
  navigationStateKey,
) {
  return {
    type: SEARCH_NOVELS_BOOKMARK_RANGES.SUCCESS,
    payload: {
      navigationStateKey,
      items,
      timestamp: Date.now(),
    },
  };
}

export function fetchSearchNovelsBookmarkRangesFailure(navigationStateKey) {
  return {
    type: SEARCH_NOVELS_BOOKMARK_RANGES.FAILURE,
    payload: {
      navigationStateKey,
    },
  };
}

export function fetchSearchNovelsBookmarkRanges(
  navigationStateKey,
  word,
  options,
) {
  return {
    type: SEARCH_NOVELS_BOOKMARK_RANGES.REQUEST,
    payload: {
      navigationStateKey,
      word,
      options,
    },
  };
}

export function clearSearchNovelsBookmarkRanges(navigationStateKey) {
  return {
    type: SEARCH_NOVELS_BOOKMARK_RANGES.CLEAR,
    payload: {
      navigationStateKey,
    },
  };
}

export function clearAllSearchNovelsBookmarkRanges() {
  return {
    type: SEARCH_NOVELS_BOOKMARK_RANGES.CLEAR_ALL,
  };
}
