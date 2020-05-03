import { LIKE_BUTTON_SETTINGS } from '../constants/actionTypes';
import { LIKE_BUTTON_ACTION_TYPES } from '../constants';

export default function likeButtonSettings(
  state = {
    actionType: LIKE_BUTTON_ACTION_TYPES.PUBLIC_LIKE,
    isShowLikeCount: true,
  },
  action = {},
) {
  switch (action.type) {
    case LIKE_BUTTON_SETTINGS.SET:
      return {
        ...state,
        actionType:
          action.payload.actionType !== undefined
            ? action.payload.actionType
            : state.actionType,
        isShowLikeCount:
          action.payload.isShowLikeCount !== undefined
            ? action.payload.isShowLikeCount
            : state.isShowLikeCount,
      };
    case LIKE_BUTTON_SETTINGS.RESTORE:
      return {
        ...state,
        ...action.payload.state,
      };
    default:
      return state;
  }
}
