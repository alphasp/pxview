/* eslint no-empty: ["error", { "allowEmptyCatch": true }] */

import React, { Component } from 'react';
import {
  Platform,
  Alert,
  PermissionsAndroid,
  DeviceEventEmitter,
  Linking,
} from 'react-native';
import { connect } from 'react-redux';
import CameraRoll from '@react-native-community/cameraroll';
import RNFetchBlob from 'rn-fetch-blob';
import hoistNonReactStatic from 'hoist-non-react-statics';
import Promise from 'bluebird';
import sanitize from 'sanitize-filename';
import { connectLocalization } from '../Localization';
import {
  SAVE_FILE_NAME_USER_FOLDER_FORMAT,
  SAVE_FILE_NAME_FORMAT,
} from '../../common/constants';

const enhanceSaveImage = (WrappedComponent) => {
  class Hoc extends Component {
    requestWriteExternalStoragePermission = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        );
        return granted;
      } catch (err) {
        return null;
      }
    };

    handleOnPressOpenAppSettings = () => {
      Linking.openSettings();
    };

    getImageSavePath = (
      workId,
      workTitle,
      workType,
      userId,
      userName,
      saveImageSettings,
    ) => {
      const { dirs } = RNFetchBlob.fs;
      const imagesBaseDir =
        Platform.OS === 'android' ? dirs.PictureDir : dirs.DocumentDir;
      let imagesDir = `${imagesBaseDir}/pxviewr/`;
      if (saveImageSettings.userFolderName) {
        switch (saveImageSettings.userFolderName) {
          case SAVE_FILE_NAME_USER_FOLDER_FORMAT.USER_NAME:
            imagesDir += sanitize(userName, {
              replacement: '_',
            });
            break;
          case SAVE_FILE_NAME_USER_FOLDER_FORMAT.USER_ID_USER_NAME:
            imagesDir += `${userId}_${sanitize(userName, {
              replacement: '_',
            })}`;
            break;
          case SAVE_FILE_NAME_USER_FOLDER_FORMAT.USER_ID:
          default:
            imagesDir += userId;
            break;
        }
      }
      if (saveImageSettings.isCreateMangaFolder && workType === 'manga') {
        switch (saveImageSettings.fileName) {
          case SAVE_FILE_NAME_FORMAT.WORK_TITLE:
            imagesDir += `/${sanitize(workTitle, {
              replacement: '_',
            })}`;
            break;
          case SAVE_FILE_NAME_FORMAT.WORK_ID_WORK_TITLE:
            imagesDir += `/${workId}_${sanitize(workTitle, {
              replacement: '_',
            })}`;
            break;
          case SAVE_FILE_NAME_FORMAT.WORK_ID:
          default:
            imagesDir += `/${workId}`;
            break;
        }
      }
      return imagesDir;
    };

    getImageFileName = (
      workId,
      workTitle,
      workType,
      saveImageSettings,
      index,
    ) => {
      let fileName;
      switch (saveImageSettings.fileName) {
        case SAVE_FILE_NAME_FORMAT.WORK_TITLE:
          fileName = `${workTitle}_p${index}.png`;
          break;
        case SAVE_FILE_NAME_FORMAT.WORK_ID_WORK_TITLE:
          fileName = `${workId}_${workTitle}_p${index}.png`;
          break;
        case SAVE_FILE_NAME_FORMAT.WORK_ID:
        default:
          fileName = `${workId}_p${index}.png`;
          break;
      }
      return sanitize(fileName, {
        replacement: '_',
      });
    };

    saveImage = async ({
      imageUrls,
      imageIndex,
      workId,
      workTitle,
      workType,
      userId,
      userName,
    }) => {
      const { i18n, saveImageSettings } = this.props;
      if (Platform.OS === 'android') {
        const granted = await this.requestWriteExternalStoragePermission();
        if (granted === PermissionsAndroid.RESULTS.DENIED) {
          return null;
        }
        if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
          return Alert.alert(
            i18n.formatString(
              i18n.permissionPromptStorageToSaveImage,
              i18n.permissionStorage,
            ),
            i18n.formatString(
              i18n.permissionPromptMessage,
              i18n.permissionStorage,
            ),
            [
              { text: i18n.permissionPromptLater },
              {
                text: i18n.permissionGrantAppSettings,
                onPress: this.handleOnPressOpenAppSettings,
              },
            ],
            { cancelable: false },
          );
        }
      }
      this.showToast(
        i18n.formatString(
          imageUrls.length > 1 ? i18n.saveImagesStart : i18n.saveImageStart,
        ),
      );
      const imagesDir = this.getImageSavePath(
        workId,
        workTitle,
        workType,
        userId,
        userName,
        saveImageSettings,
      );
      try {
        const imagesDirExists = await RNFetchBlob.fs.isDir(imagesDir);
        if (!imagesDirExists) {
          await RNFetchBlob.fs.mkdir(imagesDir);
        }
      } catch (err) {}
      await Promise.mapSeries(imageUrls, async (url, index) => {
        // const fileName = url.split('/').pop().split('#')[0].split('?')[0];
        const fileName = this.getImageFileName(
          workId,
          workTitle,
          workType,
          saveImageSettings,
          imageIndex || index,
        );
        try {
          const res = await RNFetchBlob.config({
            path: `${imagesDir}/${fileName}`,
          }).fetch('GET', url, {
            referer: 'http://www.pixiv.net',
          });
          const filePath = res.path();
          if (Platform.OS === 'ios') {
            try {
              await CameraRoll.saveToCameraRoll(filePath);
              this.showToast(
                i18n.formatString(i18n.saveImageSuccess, fileName),
              );
            } catch (err) {
              this.showToast(i18n.formatString(i18n.saveImageError, fileName));
            }
          } else if (Platform.OS === 'android') {
            this.showToast(i18n.formatString(i18n.saveImageSuccess, fileName));
            try {
              await RNFetchBlob.fs.scanFile([{ path: filePath }]);
            } catch (err) {}
          }
        } catch (err) {
          this.showToast(i18n.formatString(i18n.saveImageError, fileName));
        }
      });
      return null;
    };

    showToast = (message) => {
      DeviceEventEmitter.emit('showToast', message);
    };

    render() {
      return <WrappedComponent {...this.props} saveImage={this.saveImage} />;
    }
  }

  hoistNonReactStatic(Hoc, WrappedComponent);

  return connectLocalization(
    connect((state) => ({
      saveImageSettings: state.saveImageSettings,
    }))(Hoc),
  );
};

export default enhanceSaveImage;
