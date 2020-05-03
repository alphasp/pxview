/* eslint-disable import/prefer-default-export */

import { READING_SETTINGS } from '../constants/actionTypes';

export function setSettings({ imageReadingDirection, novelReadingDirection }) {
  return {
    type: READING_SETTINGS.SET,
    payload: {
      imageReadingDirection,
      novelReadingDirection,
    },
  };
}

export function restoreSettings(state) {
  return {
    type: READING_SETTINGS.RESTORE,
    payload: {
      state,
    },
  };
}
