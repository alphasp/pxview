import qs from "qs";
import { FOLLOWING_USER_ILLUSTS } from '../constants/actionTypes';

export function fetchFollowingUserIllustsSuccess(entities, items, nextUrl) {
  return {
    type: FOLLOWING_USER_ILLUSTS.SUCCESS,
    payload: {
      entities,
      items,
      nextUrl,
      timestamp: Date.now(),
    }
  };
}

export function fetchFollowingUserIllustsFailure() {
  return {
    type: FOLLOWING_USER_ILLUSTS.FAILURE
  };
}

export function fetchFollowingUserIllusts(nextUrl, refreshing = false) {
  const params = qs.parse(nextUrl);
  const offset = params.offset || "0";
  return {
    type: FOLLOWING_USER_ILLUSTS.REQUEST,
    payload: {
      offset,
      nextUrl,
      refreshing
    }
  };
}

export function clearFollowingUserIllusts() {
  return {
    type: FOLLOWING_USER_ILLUSTS.CLEAR
  };
}