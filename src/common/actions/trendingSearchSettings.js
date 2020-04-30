/* eslint-disable import/prefer-default-export */

import { TRENDING_SEARCH_SETTINGS } from '../constants/actionTypes';

export function setSettings({ isShowIllustImage, isShowNovelImage }) {
  return {
    type: TRENDING_SEARCH_SETTINGS.SET,
    payload: {
      isShowIllustImage,
      isShowNovelImage,
    },
  };
}
