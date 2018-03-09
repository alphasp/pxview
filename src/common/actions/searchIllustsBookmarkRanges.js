import { SEARCH_ILLUSTS_BOOKMARK_RANGES } from '../constants/actionTypes';

export function fetchSearchIllustsBookmarkRangesSuccess(
  items,
  navigationStateKey,
) {
  return {
    type: SEARCH_ILLUSTS_BOOKMARK_RANGES.SUCCESS,
    payload: {
      navigationStateKey,
      items,
      timestamp: Date.now(),
    },
  };
}

export function fetchSearchIllustsBookmarkRangesFailure(navigationStateKey) {
  return {
    type: SEARCH_ILLUSTS_BOOKMARK_RANGES.FAILURE,
    payload: {
      navigationStateKey,
    },
  };
}

export function fetchSearchIllustsBookmarkRanges(
  navigationStateKey,
  word,
  options,
) {
  return {
    type: SEARCH_ILLUSTS_BOOKMARK_RANGES.REQUEST,
    payload: {
      navigationStateKey,
      word,
      options,
    },
  };
}

export function clearSearchIllustsBookmarkRanges(navigationStateKey) {
  return {
    type: SEARCH_ILLUSTS_BOOKMARK_RANGES.CLEAR,
    payload: {
      navigationStateKey,
    },
  };
}

export function clearAllSearchIllustsBookmarkRanges() {
  return {
    type: SEARCH_ILLUSTS_BOOKMARK_RANGES.CLEAR_ALL,
  };
}
