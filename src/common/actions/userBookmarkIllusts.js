import qs from "qs";
import { USER_BOOKMARK_ILLUSTS } from '../constants/actionTypes';

export function fetchUserBookmarkIllustsSuccess(entities, items, userId, nextUrl) {
  return {
    type: USER_BOOKMARK_ILLUSTS.SUCCESS,
    payload: {
      userId,
      entities,
      items,
      nextUrl,
      timestamp: Date.now(),
    }
  };
}

export function fetchUserBookmarkIllustsFailure(userId) {
  return {
    type: USER_BOOKMARK_ILLUSTS.FAILURE,
    payload: {
      userId
    }
  };
}

export function fetchUserBookmarkIllusts(userId, tag, nextUrl, refreshing = false) {
  return {
    type: USER_BOOKMARK_ILLUSTS.REQUEST,
    payload: {
      userId,
      tag,
      nextUrl,
      refreshing
    }
  };
}

export function clearUserBookmarkIllusts(userId) {
  return {
    type: USER_BOOKMARK_ILLUSTS.CLEAR,
    payload: {
      userId
    }
  };
}

export function clearAllUserBookmarkIllusts(){
  return {
    type: USER_BOOKMARK_ILLUSTS.CLEAR_ALL,
  };
}