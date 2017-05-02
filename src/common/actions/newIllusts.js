import { NEW_ILLUSTS } from '../constants/actionTypes';

export function fetchNewIllustsSuccess(entities, items, nextUrl) {
  return {
    type: NEW_ILLUSTS.SUCCESS,
    payload: {
      entities,
      items,
      nextUrl,
      timestamp: Date.now(),
    },
  };
}

export function fetchNewIllustsFailure() {
  return {
    type: NEW_ILLUSTS.FAILURE,
  };
}

export function fetchNewIllusts(nextUrl, refreshing = false) {
  return {
    type: NEW_ILLUSTS.REQUEST,
    payload: {
      nextUrl,
      refreshing,
    },
  };
}

export function clearNewIllusts() {
  return {
    type: NEW_ILLUSTS.CLEAR,
  };
}
