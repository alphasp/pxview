import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  CameraRoll,
  Platform,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import IonicIcon from 'react-native-vector-icons/Ionicons';
import RNFetchBlob from 'react-native-fetch-blob';
import { connectLocalization } from '../components/Localization';
import PXBottomSheet from '../components/PXBottomSheet';
import PXTouchable from '../components/PXTouchable';

const styles = StyleSheet.create({
  bottomSheetListItem: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 48,
  },
  bottomSheetText: {
    marginLeft: 32,
  },
  bottomSheetCancelIcon: {
    marginLeft: 3,
  },
  bottomSheetCancelText: {
    marginLeft: 36,
  },
});

class SaveImageBottomSheet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowBottomSheet: false,
      imageUrls: [],
    };
  }

  openSaveImageBottomSheet = imageUrls => {
    this.setState({ isShowBottomSheet: true, imageUrls });
  };

  closeSaveImageBottomSheet = () => {
    this.setState({ isShowBottomSheet: false });
  };

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

  handleOnPressSaveImages = async () => {
    const { imageUrls } = this.state;
    console.log('dl images ', imageUrls);
    this.closeSaveImageBottomSheet();
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
    const { dirs } = RNFetchBlob.fs;
    const imagesBaseDir = Platform.OS === 'android'
      ? dirs.PictureDir
      : dirs.DocumentDir;
    const imagesDir = `${imagesBaseDir}/pixivrn`;
    try {
      const imagesDirExists = await RNFetchBlob.fs.isDir(imagesDir);
      console.log('imagesDir ', imagesDir, imagesDirExists);
      if (!imagesDirExists) {
        await RNFetchBlob.fs.mkdir(imagesDir);
      }
    } catch (err) {
      console.log('failed to create imagesDir ', err);
    }
    const downloadImagePromises = imageUrls.map(async url => {
      const fileName = url.split('/').pop().split('#')[0].split('?')[0];
      try {
        const res = await RNFetchBlob.config({
          path: `${imagesDir}/${fileName}`,
        }).fetch('GET', url, {
          referer: 'http://www.pixiv.net',
        });
        const filePath = res.path();
        console.log('The file saved to ', filePath);
        if (Platform.OS === 'ios') {
          try {
            const cameraRollResult = await CameraRoll.saveToCameraRoll(
              filePath,
            );
            console.log('save succeeded to camera roll ', cameraRollResult);
          } catch (err) {
            console.log('save failed to camera roll ', err);
          }
        } else if (Platform.OS === 'android') {
          try {
            await RNFetchBlob.fs.scanFile([{ path: filePath }]);
            console.log('scan success ', filePath);
          } catch (err) {
            console.log('failed to scan ', filePath, err);
          }
        }
      } catch (err) {
        console.log('error fetch blob ', err);
      }
    });
    return Promise.all(downloadImagePromises).then(results => {
      console.log('finish download all images ', results);
    });
  };

  render() {
    const { i18n } = this.props;
    const { isShowBottomSheet, imageUrls } = this.state;
    return (
      <PXBottomSheet
        visible={isShowBottomSheet}
        onCancel={this.closeSaveImageBottomSheet}
      >
        <View>
          <PXTouchable onPress={this.handleOnPressSaveImages}>
            <View style={styles.bottomSheetListItem}>
              <Icon name="floppy-o" size={24} />
              <Text style={styles.bottomSheetText}>
                {imageUrls.length > 1 ? i18n.saveAllImages : i18n.saveImage}
              </Text>
            </View>
          </PXTouchable>
          <PXTouchable onPress={this.closeSaveImageBottomSheet}>
            <View style={styles.bottomSheetListItem}>
              <IonicIcon
                name="md-close"
                size={24}
                style={styles.bottomSheetCancelIcon}
              />
              <Text
                style={[styles.bottomSheetText, styles.bottomSheetCancelText]}
              >
                {i18n.cancel}
              </Text>
            </View>
          </PXTouchable>
        </View>
      </PXBottomSheet>
    );
  }
}

export default connectLocalization(SaveImageBottomSheet);
