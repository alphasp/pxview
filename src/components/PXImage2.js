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

class PXImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageUri: null,
    };
  }

  componentDidMount() {
    const { uri, onFoundImageSize } = this.props;
    Image.getSize(`http://192.168.0.101:3000?url=${uri}`, (width, height) => {
      if (!this.unmounting) {
        this.setState({ width, height });
        if (onFoundImageSize) {
          onFoundImageSize(width, height, filePath);
        }
      }
    }, err => {
      console.error('failed to get image size ', err);
    });
  }
  // componentWillUnmount() {
  //   this.unmounting = true;
  //   if (this.task) {
  //     this.task.cancel((err, taskId) => {
  //       console.log('image canceled successfully ', taskId, err);
  //     })
  //   }
  // }
  render() {
    const { style, uri, ...otherProps } = this.props;
    const { imageUri, width, height } = this.state;
    // console.log('imageUri ', imageUri ? true : false)
    // height = <user-chosen width> * original height / original width


    return (
      (uri && width && height) ?
        <Image
          source={{
            uri: `http://192.168.0.101:3000?url=${uri}`,
          }}
          style={[{
            width: width > windowWidth ? windowWidth : width,
            height: windowWidth * height / width,
          }, style]}
          {...otherProps}
        />
      :
      null
    );

    // return (
    //   imageUri ?
    //   <Image
    //     source={{
    //       uri: imageUri
    //     }}
    //     style={style}
    //     {...otherProps}
    //   />
    //   :
    //   null
    // )
    //      <ActivityIndicator animating />
    // return (
    //   <Image
    //     source={{
    //       uri: source,
    //       headers: {
    //         referer: "http://www.pixiv.net"
    //       }
    //     }}
    //     style={ style }

    //   />
    // );
    // return (
    //   <CacheableImage
    //     resizeMode="cover"
    //     style={style}
    //     source={{
    //       uri: source,
    //       headers: {
    //         referer: "http://www.pixiv.net" // pass in optional headers to set headers when download image
    //       }
    //     }}
    //     {...otherProps}
    //   />
    // )
  }
}

export default PXImage;
