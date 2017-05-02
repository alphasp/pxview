import qs from 'qs';
import { RELATED_ILLUSTS } from '../constants/actionTypes';

export function fetchRelatedIllustsSuccess(entities, items, illustId, nextUrl) {
  return {
    type: RELATED_ILLUSTS.SUCCESS,
    payload: {
      illustId,
      entities,
      items,
      nextUrl,
      timestamp: Date.now(),
    },
  };
}

export function fetchRelatedIllustsFailure(illustId) {
  return {
    type: RELATED_ILLUSTS.FAILURE,
    payload: {
      illustId,
    },
  };
}

export function fetchRelatedIllusts(illustId, options, nextUrl, refreshing = false) {
  // no offset because next url based from seed illust ids
  // use url as offset indicator
  return {
    type: RELATED_ILLUSTS.REQUEST,
    payload: {
      illustId,
      options,
      nextUrl,
      refreshing,
    },
  };
}

export function clearRelatedIllusts(illustId) {
  return {
    type: RELATED_ILLUSTS.CLEAR,
    payload: {
      illustId,
    },
  };
}
