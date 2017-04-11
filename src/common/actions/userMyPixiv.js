import qs from "qs";
import { USER_MY_PIXIV } from '../constants/actionTypes';

export function fetchUserMyPixivSuccess(entities, items, userId, nextUrl) {
  return {
    type: USER_MY_PIXIV.SUCCESS,
    payload: {
      userId,
      entities,
      items,
      nextUrl,
      timestamp: Date.now(),
    }
  };
}

export function fetchUserMyPixivFailure(userId) {
  return {
    type: USER_MY_PIXIV.FAILURE,
    payload: {
      userId
    }
  };
}

export function fetchUserMyPixiv(userId, nextUrl, refreshing = false) {
  const params = qs.parse(nextUrl);
  const offset = params.offset || "0";
  return {
    type: USER_MY_PIXIV.REQUEST,
    payload: {
      userId,
      offset,
      nextUrl,
      refreshing
    }
  };
}

export function clearUserMyPixiv(userId) {
  return {
    type: USER_MY_PIXIV.CLEAR,
    payload: {
      userId
    }
  };
}

export function clearAllUserMyPixiv() {
  return {
    type: USER_MY_PIXIV.CLEAR_ALL
  };
}