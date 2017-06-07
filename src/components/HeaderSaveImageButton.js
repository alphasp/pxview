import React, { PureComponent } from 'react';
import {
  StyleSheet,
  Platform,
  Alert,
  PermissionsAndroid,
  CameraRoll,
  DeviceEventEmitter,
} from 'react-native';
import RNFetchBlob from 'react-native-fetch-blob';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Promise from 'bluebird';
import { connectLocalization } from '../components/Localization';
import PXTouchable from '../components/PXTouchable';

const styles = StyleSheet.create({
  icon: {
    padding: 10,
    color: '#fff',
  },
});

class HeaderSaveImageButton extends PureComponent {
  requestWriteExternalStoragePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Pixiv RN Storage Permission',
          message: 'Pixiv RN needs access to your storage ' +
            'so you can save your favorite images',
        },
      );
      return granted;
    } catch (err) {
      console.log('Failed to request Write External Storage Permission ', err);
      return null;
    }
  };

  handleOnPress = async () => {
    const { imageUrls, i18n } = this.props;
    if (Platform.OS === 'android') {
      const granted = await this.requestWriteExternalStoragePermission();
      if (granted === PermissionsAndroid.RESULTS.DENIED) {
        return null;
      }
      if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        Alert.alert(
          'Pixiv RN Storage Permission',
          'Storage Permission is required for download image feature, please enable it from system app settings',
          [{ text: 'OK' }],
          { cancelable: false },
        );
      }
    }
    this.showToast(
      i18n.formatString(
        imageUrls.length > 1 ? i18n.saveImagesStart : i18n.saveImageStart,
      ),
    );
    const { dirs } = RNFetchBlob.fs;
    const imagesBaseDir = Platform.OS === 'android'
      ? dirs.PictureDir
      : dirs.DocumentDir;
    const imagesDir = `${imagesBaseDir}/pixivrn`;
    try {
      const imagesDirExists = await RNFetchBlob.fs.isDir(imagesDir);
      if (!imagesDirExists) {
        await RNFetchBlob.fs.mkdir(imagesDir);
      }
    } catch (err) {
      console.log('failed to create imagesDir ', err);
    }
    await Promise.map(
      imageUrls,
      async url => {
        const fileName = url.split('/').pop().split('#')[0].split('?')[0];
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
            } catch (err) {
              // console.log('failed to scan ', filePath, err);
            }
          }
        } catch (err) {
          this.showToast(i18n.formatString(i18n.saveImageError, fileName));
          console.log('error fetch blob ', err);
        }
      },
      { concurrency: 3 },
    );
    return null;
  };

  showToast = message => {
    DeviceEventEmitter.emit('showToast', message);
  };

  render() {
    const { saveAll, restProps } = this.props;
    return (
      <PXTouchable onPress={this.handleOnPress} {...restProps}>
        <Icon
          name={saveAll ? 'content-save-all' : 'content-save'}
          size={20}
          style={styles.icon}
        />
      </PXTouchable>
    );
  }
}

export default connectLocalization(HeaderSaveImageButton);
