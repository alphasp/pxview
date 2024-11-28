import { DISPLAY_SETTINGS } from '../constants/actionTypes';

export function setSettings({ illustListColumns, detailScreenImageQuality }) {
  return {
    type: DISPLAY_SETTINGS.SET,
    payload: {
      illustListColumns,
      detailScreenImageQuality,
    },
  };
}

export function restoreSettings(state) {
  return {
    type: DISPLAY_SETTINGS.RESTORE,
    payload: {
      state,
    },
  };
}
