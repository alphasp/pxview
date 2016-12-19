export const ADD_SEARCH_HISTORY = 'ADD_SEARCH_HISTORY';
export const REMOVE_SEARCH_HISTORY = 'REMOVE_SEARCH_HISTORY';
export const CLEAR_SEARCH_HISTORY = 'CLEAR_SEARCH_HISTORY';

export function addSearchHistory(item) {
  return {
    type: ADD_SEARCH_HISTORY,
    payload: {
      item
    }
  }
}
export function removeSearchHistory(item) {
  return {
    type: REMOVE_SEARCH_HISTORY,
    payload: {
      item
    }
  }
}

export function clearSearchHistory() {
  return {
    type: CLEAR_SEARCH_HISTORY,
  }
}