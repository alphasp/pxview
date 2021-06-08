import React from 'react';
import {
  View,
  Alert,
  DeviceEventEmitter,
  Platform,
  PermissionsAndroid,
  Linking,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from 'react-native-paper';
import DeviceInfo from 'react-native-device-info';
import moment from 'moment';
import RNFetchBlob from 'rn-fetch-blob';
import { useLocalization } from '../../components/Localization';
import PXListItem from '../../components/PXListItem';
import { globalStyles } from '../../styles';
import {
  restoreReadingSettings,
  restoreSaveImageSettings,
  restoreInitialScreenSettings,
  restoreLikeButtonSettings,
  restoreTrendingSearchSettings,
  restoreMuteSettings,
  restoreHighlightTags,
  restoreMuteTags,
  restoreMuteUsers,
  restoreNovelSettings,
  restoreSearchHistory,
  restoreTheme,
} from '../../common/actions/dataBackup';

const { dirs, isDir, mkdir, writeFile, readFile, exists } = RNFetchBlob.fs;

const Backup = () => {
  const dispatch = useDispatch();
  const readingSettings = useSelector((state) => state.readingSettings);
  const saveImageSettings = useSelector((state) => state.saveImageSettings);
  const initialScreenSettings = useSelector(
    (state) => state.initialScreenSettings,
  );
  const likeButtonSettings = useSelector((state) => state.likeButtonSettings);
  const trendingSearchSettings = useSelector(
    (state) => state.trendingSearchSettings,
  );
  const highlightTags = useSelector((state) => state.highlightTags);
  const muteSettings = useSelector((state) => state.muteSettings);
  const muteTags = useSelector((state) => state.muteTags);
  const muteUsers = useSelector((state) => state.muteUsers);
  const novelSettings = useSelector((state) => state.novelSettings);
  const themeSettings = useSelector((state) => state.theme);
  const searchHistory = useSelector((state) => state.searchHistory);

  const theme = useTheme();
  const { i18n } = useLocalization();
  const baseDir = Platform.OS === 'android' ? dirs.SDCardDir : dirs.DocumentDir;
  const backupFileDir = `${baseDir}/pxviewr/backup`;
  const backupFilePath = `${backupFileDir}/backup.json`;

  const showToast = (message) => {
    DeviceEventEmitter.emit('showToast', message);
  };

  const handleOnPressOpenAppSettings = () => {
    Linking.openSettings();
  };

  const requestWriteExternalStoragePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      );
      return granted;
    } catch (err) {
      return null;
    }
  };

  const checkPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await requestWriteExternalStoragePermission();
      if (granted === PermissionsAndroid.RESULTS.DENIED) {
        return null;
      }
      if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        return Alert.alert(
          i18n.formatString(
            i18n.permissionPromptStorageToBackup,
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
              onPress: handleOnPressOpenAppSettings,
            },
          ],
          { cancelable: false },
        );
      }
    }
  };

  const handleOnPressConfirmBackup = async () => {
    try {
      await checkPermission();
      const backupSettings = JSON.stringify({
        appVersion: DeviceInfo.getVersion(),
        createdAt: moment().toDate(),
        data: {
          readingSettings,
          saveImageSettings,
          initialScreenSettings,
          likeButtonSettings,
          trendingSearchSettings,
          highlightTags,
          muteSettings,
          muteTags,
          muteUsers,
          novelSettings,
          theme: themeSettings,
          searchHistory,
        },
      });
      // persmission
      const backupFileDirExists = await isDir(backupFileDir);
      if (!backupFileDirExists) {
        await mkdir(backupFileDir);
      }
      await writeFile(backupFilePath, backupSettings, 'utf8');
      showToast(i18n.formatString(i18n.backupSuccessfully, backupFilePath));
    } catch (err) {}
  };

  const handleOnPressConfirmRestore = async () => {
    try {
      await checkPermission();
      const isBackupExists = await exists(backupFilePath);
      if (!isBackupExists) {
        return showToast(i18n.backupFileNotFound);
      }
      const response = await readFile(backupFilePath, 'utf8');
      if (response) {
        const parsedData = JSON.parse(response);
        if (parsedData?.data) {
          if (parsedData?.data.readingSettings) {
            dispatch(restoreReadingSettings(parsedData.data.readingSettings));
          }
          if (parsedData?.data.saveImageSettings) {
            dispatch(
              restoreSaveImageSettings(parsedData.data.saveImageSettings),
            );
          }
          if (parsedData?.data.initialScreenSettings) {
            dispatch(
              restoreInitialScreenSettings(
                parsedData.data.initialScreenSettings,
              ),
            );
          }
          if (parsedData?.data.likeButtonSettings) {
            dispatch(
              restoreLikeButtonSettings(parsedData.data.likeButtonSettings),
            );
          }
          if (parsedData?.data.trendingSearchSettings) {
            dispatch(
              restoreTrendingSearchSettings(
                parsedData.data.trendingSearchSettings,
              ),
            );
          }
          if (parsedData?.data.highlightTags) {
            dispatch(restoreHighlightTags(parsedData.data.highlightTags));
          }
          if (parsedData?.data.muteSettings) {
            dispatch(restoreMuteSettings(parsedData.data.muteSettings));
          }
          if (parsedData?.data.muteTags) {
            dispatch(restoreMuteTags(parsedData.data.muteTags));
          }
          if (parsedData?.data.muteUsers) {
            dispatch(restoreMuteUsers(parsedData.data.muteUsers));
          }
          if (parsedData?.data.novelSettings) {
            dispatch(restoreNovelSettings(parsedData.data.novelSettings));
          }
          if (parsedData?.data.searchHistory) {
            dispatch(restoreSearchHistory(parsedData.data.searchHistory));
          }
          if (parsedData?.data.theme) {
            dispatch(restoreTheme(parsedData.data.theme));
          }
          showToast(i18n.backupRestoreSuccessfully);
        }
      }
    } catch (err) {}
  };

  const handleOnPressBackup = () => {
    Alert.alert(
      i18n.backupConfirm,
      null,
      [
        { text: i18n.cancel, style: 'cancel' },
        { text: i18n.ok, onPress: handleOnPressConfirmBackup },
      ],
      { cancelable: false },
    );
  };

  const handleOnPressRestore = () => {
    Alert.alert(
      i18n.backupRestoreConfirm,
      null,
      [
        { text: i18n.cancel, style: 'cancel' },
        { text: i18n.ok, onPress: handleOnPressConfirmRestore },
      ],
      { cancelable: false },
    );
  };

  return (
    <View
      style={[
        globalStyles.container,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <PXListItem
        title={i18n.backupData}
        description={i18n.backupDataDescription}
        onPress={handleOnPressBackup}
      />
      <PXListItem
        title={i18n.backupRestoreData}
        onPress={handleOnPressRestore}
      />
    </View>
  );
};

export default Backup;
