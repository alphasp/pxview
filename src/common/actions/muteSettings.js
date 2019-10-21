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
