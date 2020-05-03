import { MUTE_USERS } from '../constants/actionTypes';

export function addMuteUser(item) {
  return {
    type: MUTE_USERS.ADD,
    payload: {
      item,
    },
  };
}

export function removeMuteUser(id) {
  return {
    type: MUTE_USERS.REMOVE,
    payload: {
      id,
    },
  };
}

export function clearMuteUsers() {
  return {
    type: MUTE_USERS.CLEAR,
  };
}

export function restoreSettings(state) {
  return {
    type: MUTE_USERS.RESTORE,
    payload: {
      state,
    },
  };
}
