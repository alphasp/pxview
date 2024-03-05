import { DISPLAY_SETTINGS } from '../constants/actionTypes';
import { ILLUST_LIST_COLUMNS, IMAGE_QUALITY_LEVELS } from '../constants';

export default function displaySettings(
  state = {
    illustListColumns: ILLUST_LIST_COLUMNS['3'],
    detailScreenImageQuality: IMAGE_QUALITY_LEVELS.MEDIUM,
  },
  action = {},
) {
  switch (action.type) {
    case DISPLAY_SETTINGS.SET:
      return {
        ...state,
        illustListColumns:
          action.payload.illustListColumns !== undefined
            ? action.payload.illustListColumns
            : state.illustListColumns,
        detailScreenImageQuality:
          action.payload.detailScreenImageQuality !== undefined
            ? action.payload.detailScreenImageQuality
            : state.detailScreenImageQuality,
      };
    case DISPLAY_SETTINGS.RESTORE:
      return {
        ...state,
        ...action.payload.state,
      };
    default:
      return state;
  }
}
