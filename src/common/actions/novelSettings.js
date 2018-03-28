import { NOVEL_SETTINGS } from '../constants/actionTypes';

export function setProperties({ fontSize, lineHeight }) {
  return {
    type: NOVEL_SETTINGS.SET,
    payload: {
      fontSize,
      lineHeight,
    },
  };
}
