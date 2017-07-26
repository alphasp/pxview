import { WALKTHROUGH_ILLUSTS } from '../constants/actionTypes';

export function fetchWalkthroughIllustsSuccess(entities, items) {
  return {
    type: WALKTHROUGH_ILLUSTS.SUCCESS,
    payload: {
      entities,
      items,
      timestamp: Date.now(),
    },
  };
}

export function fetchWalkthroughIllustsFailure() {
  return {
    type: WALKTHROUGH_ILLUSTS.FAILURE,
  };
}

export function fetchWalkthroughIllusts(refreshing = false) {
  return {
    type: WALKTHROUGH_ILLUSTS.REQUEST,
    payload: {
      refreshing,
    },
  };
}

export function clearWalkthroughIllusts() {
  return {
    type: WALKTHROUGH_ILLUSTS.CLEAR,
  };
}
