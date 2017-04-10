import qs from "qs";
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
    }
  };
}

export function fetchRelatedIllustsFailure() {
  return {
    type: RELATED_ILLUSTS.FAILURE,
  };
}

export function fetchRelatedIllusts(illustId, options, url, refreshing = false) {
  //no offset because next url based from seed illust ids
  //use url as offset indicator
  return {
    type: RELATED_ILLUSTS.REQUEST,
    payload: {
      illustId,
      options,
      url,
      refreshing
    }
  };
}

export function clearRelatedIllusts(illustId) {
  return {
    type: RELATED_ILLUSTS.CLEAR,
    payload: {
      illustId
    }
  };
}