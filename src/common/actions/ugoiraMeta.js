import { UGOIRA_META } from '../constants/actionTypes';

export function fetchUgoiraMetaSuccess(item, illustId) {
  return {
    type: UGOIRA_META.SUCCESS,
    payload: {
      illustId,
      item,
      timestamp: Date.now(),
    },
  };
}

export function fetchUgoiraMetaFailure(illustId) {
  return {
    type: UGOIRA_META.FAILURE,
    payload: {
      illustId,
    },
  };
}

export function fetchUgoiraMeta(illustId) {
  return {
    type: UGOIRA_META.REQUEST,
    payload: {
      illustId,
    },
  };
}

export function clearUgoiraMeta(illustId) {
  return {
    type: UGOIRA_META.CLEAR,
    payload: {
      illustId,
    },
  };
}
