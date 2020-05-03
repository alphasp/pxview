/* eslint-disable import/prefer-default-export */

import { LIKE_BUTTON_SETTINGS } from '../constants/actionTypes';

export function setSettings({ actionType, isShowLikeCount }) {
  return {
    type: LIKE_BUTTON_SETTINGS.SET,
    payload: {
      actionType,
      isShowLikeCount,
    },
  };
}

export function restoreSettings(state) {
  return {
    type: LIKE_BUTTON_SETTINGS.RESTORE,
    payload: {
      state,
    },
  };
}
