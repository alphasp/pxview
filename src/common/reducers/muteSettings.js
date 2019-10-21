import { MUTE_SETTINGS } from '../constants/actionTypes';

export default function likeButtonSettings(
  state = {
    isHideMute: false,
  },
  action = {},
) {
  switch (action.type) {
    case MUTE_SETTINGS.SET:
      return {
        ...state,
        isHideMute:
          action.payload.isHideMute !== undefined
            ? action.payload.isHideMute
            : state.isHideMute,
      };
    default:
      return state;
  }
}
