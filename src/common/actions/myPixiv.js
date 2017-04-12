import { MY_PIXIV } from '../constants/actionTypes';

export function fetchMyPixivSuccess(entities, items, nextUrl) {
  return {
    type: MY_PIXIV.SUCCESS,
    payload: {
      entities,
      items,
      nextUrl,
      timestamp: Date.now(),
    }
  };
}

export function fetchMyPixivFailure() {
  return {
    type: MY_PIXIV.FAILURE
  };
}

export function fetchMyPixiv(nextUrl, refreshing = false) {
  return {
    type: MY_PIXIV.REQUEST,
    payload: {
      nextUrl,
      refreshing
    }
  };
}

export function clearMyPixiv() {
  return {
    type: MY_PIXIV.CLEAR
  };
}