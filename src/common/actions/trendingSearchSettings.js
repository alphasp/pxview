/* eslint-disable import/prefer-default-export */

import { TRENDING_SEARCH_SETTINGS } from '../constants/actionTypes';

export function setSettings({
  isShowTrendingIllustTag,
  isShowTrendingNovelTag,
  isShowRecommendedUser,
  isShowIllustImage,
  isShowNovelImage,
  isShowRecommendedUserWork,
}) {
  return {
    type: TRENDING_SEARCH_SETTINGS.SET,
    payload: {
      isShowTrendingIllustTag,
      isShowTrendingNovelTag,
      isShowRecommendedUser,
      isShowIllustImage,
      isShowNovelImage,
      isShowRecommendedUserWork,
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
