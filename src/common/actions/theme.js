import { THEME } from '../constants/actionTypes';

export function setTheme(name) {
  return {
    type: THEME.SET,
    payload: {
      name,
    },
  };
}
