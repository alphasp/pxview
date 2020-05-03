/* eslint-disable import/prefer-default-export */

import { NOVEL_SETTINGS } from '../constants/actionTypes';

export function setProperties({ fontSize, lineHeight }) {
  return {
    type: NOVEL_SETTINGS.SET,
    payload: {
      fontSize,
      lineHeight,
    },
  };
}

export function restoreSettings(state) {
  return {
    type: NOVEL_SETTINGS.RESTORE,
    payload: {
      state,
    },
  };
}
