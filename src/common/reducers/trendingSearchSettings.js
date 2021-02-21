import { TRENDING_SEARCH_SETTINGS } from '../constants/actionTypes';

const initState = {
  isShowTrendingIllustTag: true,
  isShowTrendingNovelTag: true,
  isShowRecommendedUser: true,
  isShowIllustImage: false,
  isShowNovelImage: false,
  isShowRecommendedUserWork: false,
};

export default function trendingSearchSettings(state = initState, action) {
  switch (action.type) {
    case TRENDING_SEARCH_SETTINGS.SET:
      return {
        ...state,
        isShowTrendingIllustTag:
          action.payload.isShowTrendingIllustTag !== undefined
            ? action.payload.isShowTrendingIllustTag
            : state.isShowTrendingIllustTag,
        isShowTrendingNovelTag:
          action.payload.isShowTrendingNovelTag !== undefined
            ? action.payload.isShowTrendingNovelTag
            : state.isShowTrendingNovelTag,
        isShowRecommendedUser:
          action.payload.isShowRecommendedUser !== undefined
            ? action.payload.isShowRecommendedUser
            : state.isShowRecommendedUser,
        isShowIllustImage:
          action.payload.isShowIllustImage !== undefined
            ? action.payload.isShowIllustImage
            : state.isShowIllustImage,
        isShowNovelImage:
          action.payload.isShowNovelImage !== undefined
            ? action.payload.isShowNovelImage
            : state.isShowNovelImage,
        isShowRecommendedUserWork:
          action.payload.isShowRecommendedUserWork !== undefined
            ? action.payload.isShowRecommendedUserWork
            : state.isShowRecommendedUserWork,
      };
    case TRENDING_SEARCH_SETTINGS.RESTORE:
      return {
        ...state,
        ...action.payload.state,
      };
    default:
      return state;
  }
}
