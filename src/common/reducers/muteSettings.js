import { MUTE_SETTINGS } from '../constants/actionTypes';

export default function muteSettings(
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
    case MUTE_SETTINGS.RESTORE:
      return {
        ...state,
        ...action.payload.state,
      };
    default:
      return state;
  }
}
