import { MY_ACCOUNT_STATE } from '../constants/actionTypes';

export function fetchMyAccountStateSuccess(item) {
  return {
    type: MY_ACCOUNT_STATE.SUCCESS,
    payload: {
      item,
      timestamp: Date.now(),
      // "is_mail_authorized": true,
      // "has_changed_pixiv_id": false,
      // "can_change_pixiv_id": true
    },
  };
}

export function fetchMyAccountStateFailure() {
  return {
    type: MY_ACCOUNT_STATE.FAILURE,
  };
}

export function fetchMyAccountState() {
  return {
    type: MY_ACCOUNT_STATE.REQUEST,
  };
}

export function clearMyAccountState() {
  return {
    type: MY_ACCOUNT_STATE.CLEAR,
  };
}
