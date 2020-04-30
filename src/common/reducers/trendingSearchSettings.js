import { TRENDING_SEARCH_SETTINGS } from '../constants/actionTypes';

const initState = {
  isShowIllustImage: true,
  isShowNovelImage: true,
};

export default function trendingSearchSettings(state = initState, action) {
  switch (action.type) {
    case TRENDING_SEARCH_SETTINGS.SET:
      return {
        ...state,
        isShowIllustImage:
          action.payload.isShowIllustImage !== undefined
            ? action.payload.isShowIllustImage
            : state.isShowIllustImage,
        isShowNovelImage:
          action.payload.isShowNovelImage !== undefined
            ? action.payload.isShowNovelImage
            : state.isShowNovelImage,
      };
    default:
      return state;
  }
}
