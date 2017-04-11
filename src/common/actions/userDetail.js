import qs from "qs";
import { USER_DETAIL } from '../constants/actionTypes';

export function fetchUserDetailSuccess(entities, item, userId) {
  return {
    type: USER_DETAIL.SUCCESS,
    payload: {
      userId,
      entities,
      item,
      timestamp: Date.now(),
    }
  };
}

export function fetchUserDetailFailure(userId) {
  return {
    type: USER_DETAIL.FAILURE,
    payload: {
      userId
    }
  };
}

export function fetchUserDetail(userId, refreshing = false) {
  return {
    type: USER_DETAIL.REQUEST,
    payload: {
      userId,
      refreshing
    }
  };
}

export function clearUserDetail(userId) {
  return {
    type: USER_DETAIL.CLEAR,
    payload: {
      userId
    }
  };
}

export function clearAllUserDetail(){
  return {
    type: USER_DETAIL.CLEAR_ALL,
  };
}