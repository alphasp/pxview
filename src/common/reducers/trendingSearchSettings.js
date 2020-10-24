import { TRENDING_SEARCH_SETTINGS } from '../constants/actionTypes';

const initState = {
  isShowTrendingIllustTag: true,
  isShowTrendingNovelTag: true,
  isShowIllustImage: true,
  isShowNovelImage: true,
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
        isShowIllustImage:
          action.payload.isShowIllustImage !== undefined
            ? action.payload.isShowIllustImage
            : state.isShowIllustImage,
        isShowNovelImage:
          action.payload.isShowNovelImage !== undefined
            ? action.payload.isShowNovelImage
            : state.isShowNovelImage,
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
