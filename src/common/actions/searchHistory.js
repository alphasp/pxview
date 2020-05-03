import { SEARCH_HISTORY } from '../constants/actionTypes';

export function addSearchHistory(item) {
  return {
    type: SEARCH_HISTORY.ADD,
    payload: {
      item,
    },
  };
}

export function removeSearchHistory(item) {
  return {
    type: SEARCH_HISTORY.REMOVE,
    payload: {
      item,
    },
  };
}

export function clearSearchHistory() {
  return {
    type: SEARCH_HISTORY.CLEAR,
  };
}

export function restoreSettings(state) {
  return {
    type: SEARCH_HISTORY.RESTORE,
    payload: {
      state,
    },
  };
}
