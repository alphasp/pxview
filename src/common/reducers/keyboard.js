import { KEYBOARD } from '../constants/actionTypes';

export default function i18n(
  state = {
    visible: false,
  },
  action,
) {
  switch (action.type) {
    case KEYBOARD.SHOW:
      return {
        ...state,
        visible: true,
      };
    case KEYBOARD.HIDE:
      return {
        ...state,
        visible: false,
      };
    default:
      return state;
  }
}
