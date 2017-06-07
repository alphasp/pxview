import { KEYBOARD } from '../constants/actionTypes';

export function keyboardDidShow() {
  return {
    type: KEYBOARD.SHOW,
  };
}

export function keyboardDidHide() {
  return {
    type: KEYBOARD.HIDE,
  };
}
