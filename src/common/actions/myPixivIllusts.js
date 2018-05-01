import { MY_PIXIV_ILLUSTS } from '../constants/actionTypes';

export function fetchMyPixivIllustsSuccess(entities, items, nextUrl) {
  return {
    type: MY_PIXIV_ILLUSTS.SUCCESS,
    payload: {
      entities,
      items,
      nextUrl,
      timestamp: Date.now(),
    },
  };
}

export function fetchMyPixivIllustsFailure() {
  return {
    type: MY_PIXIV_ILLUSTS.FAILURE,
  };
}

export function fetchMyPixivIllusts(nextUrl, refreshing = false) {
  return {
    type: MY_PIXIV_ILLUSTS.REQUEST,
    payload: {
      nextUrl,
      refreshing,
    },
  };
}

export function clearMyPixivIllusts() {
  return {
    type: MY_PIXIV_ILLUSTS.CLEAR,
  };
}
