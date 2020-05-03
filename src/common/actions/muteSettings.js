/* eslint-disable import/prefer-default-export */

import { MUTE_SETTINGS } from '../constants/actionTypes';

export function setSettings({ isHideMute }) {
  return {
    type: MUTE_SETTINGS.SET,
    payload: {
      isHideMute,
    },
  };
}

export function restoreSettings(state) {
  return {
    type: MUTE_SETTINGS.RESTORE,
    payload: {
      state,
    },
  };
}
