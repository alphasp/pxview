import { SAVE_IMAGE_SETTINGS } from '../constants/actionTypes';

export function setSettings({ userFolderName, fileName, isCreateMangaFolder }) {
  return {
    type: SAVE_IMAGE_SETTINGS.SET,
    payload: {
      userFolderName,
      fileName,
      isCreateMangaFolder,
    },
  };
}
