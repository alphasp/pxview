/* eslint-disable import/prefer-default-export */

import { LIKE_BUTTON_SETTINGS } from '../constants/actionTypes';

export function setLikeButtonAction(actionType) {
  return {
    type: LIKE_BUTTON_SETTINGS.SET,
    payload: {
      actionType,
    },
  };
}
