import { NOVEL_SETTINGS } from '../constants/actionTypes';

export const NOVEL_SETTINGS_SET_PROPERTIES = 'NOVEL_SETTINGS_SET_PROPERTIES';

export function setProperties({ fontSize, lineHeight }) {
  return {
    type: NOVEL_SETTINGS.SET,
    payload: {
      fontSize,
      lineHeight,
    },
  };
}
