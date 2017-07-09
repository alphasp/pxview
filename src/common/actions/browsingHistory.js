import { BROWSING_HISTORY } from '../constants/actionTypes';

export function addBrowsingHistory(item) {
  return {
    type: BROWSING_HISTORY.ADD,
    payload: {
      item,
    },
  };
}

export function removeBrowsingHistory(item) {
  return {
    type: BROWSING_HISTORY.REMOVE,
    payload: {
      item,
    },
  };
}

export function clearBrowsingHistory() {
  return {
    type: BROWSING_HISTORY.CLEAR,
  };
}
