import { SAVE_IMAGE_SETTINGS } from '../constants/actionTypes';
import { SAVE_FILE_NAME_FORMAT } from '../constants';

const initState = {
  userFolderName: null,
  fileName: SAVE_FILE_NAME_FORMAT.WORK_ID,
  isCreateMangaFolder: false,
};

export default function saveImageSettings(state = initState, action) {
  switch (action.type) {
    case SAVE_IMAGE_SETTINGS.SET:
      return {
        ...state,
        userFolderName:
          action.payload.userFolderName !== undefined
            ? action.payload.userFolderName
            : state.userFolderName,
        fileName:
          action.payload.fileName !== undefined
            ? action.payload.fileName
            : state.fileName,
        isCreateMangaFolder:
          action.payload.isCreateMangaFolder !== undefined
            ? action.payload.isCreateMangaFolder
            : state.isCreateMangaFolder,
      };
    case SAVE_IMAGE_SETTINGS.RESTORE:
      return {
        ...state,
        ...action.payload.state,
      };
    default:
      return state;
  }
}
