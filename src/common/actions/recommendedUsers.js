import qs from "qs";
import { RECOMMENDED_USERS } from '../constants/actionTypes';

export function fetchRecommendedUsersSuccess(entities, items, nextUrl) {
  return {
    type: RECOMMENDED_USERS.SUCCESS,
    payload: {
      entities,
      items,
      nextUrl,
      timestamp: Date.now(),
    }
  };
}

export function fetchRecommendedUsersFailure() {
  return {
    type: RECOMMENDED_USERS.FAILURE,
  };
}

export function fetchRecommendedUsers(options, nextUrl, refreshing = false) {
  const params = qs.parse(nextUrl);
  const offset = params.offset || "0";
  return {
    type: RECOMMENDED_USERS.REQUEST,
    payload: {
      options,
      offset,
      nextUrl,
      refreshing
    }
  };
}

export function clearRecommendedUsers() {
  return {
    type: RECOMMENDED_USERS.CLEAR,
  };
}