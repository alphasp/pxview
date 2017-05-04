import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  RefreshControl,
  Dimensions,
  Platform,
} from 'react-native';
// import Image from 'react-native-image-progress';
import moment from 'moment';
// import CacheableImage from 'react-native-cacheable-image';
import FitImage from 'react-native-fit-image';
import RNFetchBlob from 'react-native-fetch-blob';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

class Playground extends Component {
  render() {
    const { style, uri, ...otherProps } = this.props;
    // const { imageUri, width, height } = this.state;
    // console.log('imageUri ', imageUri ? true : false)
    // height = <user-chosen width> * original height / original width
    return (
      <Image
        source={{
          uri,
          headers: {
            referer: 'http://www.pixiv.net',
          },
        }}
        style={{
          width: windowWidth,
          height: windowHeight,
        }}
        resizeMode="contain"
        {...otherProps}
      />
    );
  }
}
// aspectRatio: 1
export default Playground;
