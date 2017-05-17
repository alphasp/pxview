import React, { Component } from 'react';
import { View, Text, StyleSheet, CameraRoll } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import IonicIcon from 'react-native-vector-icons/Ionicons';
import RNFetchBlob from 'react-native-fetch-blob';
import PXBottomSheet from '../components/PXBottomSheet';
import PXTouchable from '../components/PXTouchable';

const styles = StyleSheet.create({
  bottomSheet: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  bottomSheetText: {
    marginLeft: 32,
  },
  bottomSheetListItem: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 48,
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

  handleOnPressSaveImages = () => {
    const { imageUrls } = this.state;
    console.log('dl images ', imageUrls);
    const { dirs } = RNFetchBlob.fs;
    this.closeSaveImageBottomSheet();
    const downloadImagePromises = imageUrls.map(url => {
      const fileName = url.split('/').pop().split('#')[0].split('?')[0];
      return RNFetchBlob.config({
        path: `${dirs.DocumentDir}/${fileName}`,
      })
        .fetch('GET', url, {
          referer: 'http://www.pixiv.net',
          //'Cache-Control' : 'no-store'
        })
        .then(res => {
          console.log('The file saved to ', res.path());
          CameraRoll.saveToCameraRoll(res.path())
            .then(result => {
              console.log('save succeeded to camera roll ', result);
            })
            .catch(err => {
              console.log('save failed to camera roll ', err);
            });
        })
        .catch((err, statusCode) => {
          // error handling
          console.log('error fetch blob ', err, statusCode);
        })
        .then(() => null);
    });
    return Promise.all(downloadImagePromises).then(results => {
      console.log('finish download all images ', results);
    });
  };

  render() {
    const { isShowBottomSheet, imageUrls } = this.state;
    return (
      <PXBottomSheet
        visible={isShowBottomSheet}
        onCancel={this.closeSaveImageBottomSheet}
      >
        <View style={styles.bottomSheet}>
          <PXTouchable onPress={this.handleOnPressSaveImages}>
            <View style={styles.bottomSheetListItem}>
              <Icon name="floppy-o" size={24} />
              <Text style={styles.bottomSheetText}>
                {imageUrls.length > 1 ? 'Save All Images' : 'Save Image'}
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
                Cancel
              </Text>
            </View>
          </PXTouchable>
        </View>
      </PXBottomSheet>
    );
  }
}

export default SaveImageBottomSheet;
