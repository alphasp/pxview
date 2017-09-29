import { ILLUST_DETAIL } from '../constants/actionTypes';

export function fetchIllustDetailSuccess(entities, item, illustId) {
  return {
    type: ILLUST_DETAIL.SUCCESS,
    payload: {
      illustId,
      entities,
      item,
      timestamp: Date.now(),
    },
  };
}

export function fetchIllustDetailFailure(illustId) {
  return {
    type: ILLUST_DETAIL.FAILURE,
    payload: {
      illustId,
    },
  };
}

export function fetchIllustDetail(illustId, refreshing = false) {
  return {
    type: ILLUST_DETAIL.REQUEST,
    payload: {
      illustId,
      refreshing,
    },
  };
}

export function clearIllustDetail(illustId) {
  return {
    type: ILLUST_DETAIL.CLEAR,
    payload: {
      illustId,
    },
  };
}

export function clearAllIllustDetail() {
  return {
    type: ILLUST_DETAIL.CLEAR_ALL,
  };
}
