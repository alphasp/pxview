import { MUTE_USERS } from '../constants/actionTypes';

export function addMuteUser(item) {
  return {
    type: MUTE_USERS.ADD,
    payload: {
      item,
    },
  };
}

export function removeMuteUser(item) {
  return {
    type: MUTE_USERS.REMOVE,
    payload: {
      item,
    },
  };
}

export function clearMuteUsers() {
  return {
    type: MUTE_USERS.CLEAR,
  };
}
