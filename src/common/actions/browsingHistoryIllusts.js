import { BROWSING_HISTORY_ILLUSTS } from '../constants/actionTypes';

export function addBrowsingHistoryIllusts(item) {
  return {
    type: BROWSING_HISTORY_ILLUSTS.ADD,
    payload: {
      item,
    },
  };
}

export function removeBrowsingHistoryIllusts(item) {
  return {
    type: BROWSING_HISTORY_ILLUSTS.REMOVE,
    payload: {
      item,
    },
  };
}

export function clearBrowsingHistoryIllusts() {
  return {
    type: BROWSING_HISTORY_ILLUSTS.CLEAR,
  };
}
