import { BROWSING_HISTORY_NOVELS } from '../constants/actionTypes';

export function addBrowsingHistoryNovels(item) {
  return {
    type: BROWSING_HISTORY_NOVELS.ADD,
    payload: {
      item,
    },
  };
}

export function removeBrowsingHistoryNovels(item) {
  return {
    type: BROWSING_HISTORY_NOVELS.REMOVE,
    payload: {
      item,
    },
  };
}

export function clearBrowsingHistoryNovels() {
  return {
    type: BROWSING_HISTORY_NOVELS.CLEAR,
  };
}
