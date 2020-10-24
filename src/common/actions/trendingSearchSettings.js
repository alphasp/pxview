/* eslint-disable import/prefer-default-export */

import { TRENDING_SEARCH_SETTINGS } from '../constants/actionTypes';

export function setSettings({
  isShowTrendingIllustTag,
  isShowTrendingNovelTag,
  isShowIllustImage,
  isShowNovelImage,
}) {
  return {
    type: TRENDING_SEARCH_SETTINGS.SET,
    payload: {
      isShowTrendingIllustTag,
      isShowTrendingNovelTag,
      isShowIllustImage,
      isShowNovelImage,
    },
  };
}

export function restoreSettings(state) {
  return {
    type: TRENDING_SEARCH_SETTINGS.RESTORE,
    payload: {
      state,
    },
  };
}
