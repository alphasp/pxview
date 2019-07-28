import { LIKE_BUTTON_SETTINGS } from '../constants/actionTypes';
import { LIKE_BUTTON_ACTION_TYPES } from '../constants';

export default function likeButtonSettings(
  state = {
    actionType: LIKE_BUTTON_ACTION_TYPES.PUBLIC_LIKE,
  },
  action = {},
) {
  switch (action.type) {
    case LIKE_BUTTON_SETTINGS.SET:
      return {
        ...state,
        actionType: action.payload.actionType,
      };
    default:
      return state;
  }
}
