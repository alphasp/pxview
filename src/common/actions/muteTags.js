import { MUTE_TAGS } from '../constants/actionTypes';

export function addMuteTag(item) {
  return {
    type: MUTE_TAGS.ADD,
    payload: {
      item,
    },
  };
}

export function removeMuteTag(item) {
  return {
    type: MUTE_TAGS.REMOVE,
    payload: {
      item,
    },
  };
}

export function clearMuteTags() {
  return {
    type: MUTE_TAGS.CLEAR,
  };
}

export function restoreSettings(state) {
  return {
    type: MUTE_TAGS.RESTORE,
    payload: {
      state,
    },
  };
}
