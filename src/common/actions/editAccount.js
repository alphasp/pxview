import { EDIT_ACCOUNT } from '../constants/actionTypes';

export function editAccountSuccess() {
  return {
    type: EDIT_ACCOUNT.SUCCESS,
    payload: {
      timestamp: Date.now(),
    },
  };
}

export function editAccountFailure(validationErrors) {
  return {
    type: EDIT_ACCOUNT.FAILURE,
    payload: {
      validationErrors,
    },
  };
}

export function editAccount({ currentPassword, newPassword, pixivId, email }) {
  return {
    type: EDIT_ACCOUNT.REQUEST,
    payload: {
      currentPassword,
      newPassword,
      pixivId,
      email,
    },
  };
}

// reset state to init state
export function editAccountClear() {
  return {
    type: EDIT_ACCOUNT.CLEAR,
  };
}
