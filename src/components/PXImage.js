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
import CacheableImage from 'react-native-cacheable-image';
import FitImage from 'react-native-fit-image';
import RNFetchBlob from 'react-native-fetch-blob'
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

class PXImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageUri: null
    }
  }
  
  componentDidMount() {
    const { uri, onFoundImageSize } = this.props;
    this.task = RNFetchBlob
      .config({
        fileCache : true,
        appendExt: 'png',
        key: uri,
        session: moment().startOf('day'),
      }).fetch('GET', uri, {
        referer: "http://www.pixiv.net",
        //'Cache-Control' : 'no-store'
      });
    this.task.then(res => {
      if (!this.unmounting) {
        //const base64Str = `data:image/png;base64,${res.base64()}`;
        const filePath = Platform.OS === 'android' ? 'file://' + res.path()  : '' + res.path();
        Image.getSize(filePath, (width, height) => {
          if (!this.unmounting) {
            this.setState({width, height});
            if (onFoundImageSize) {
              onFoundImageSize(width, height, filePath);
            }
          }
        }, err => {
          //console.error('failed to get image size ', err);
        });
        this.setState({
          imageUri: filePath
        })
      }
    })
    .catch((err, statusCode) => {
      // error handling
      console.log('error fetch blob ', err)
    });
  }
  componentWillUnmount() {
    this.unmounting = true;
    if (this.task) {
      this.task.cancel();
    }
  }
  render() {
    const { style, ...otherProps } = this.props;
    const { imageUri, width, height } = this.state;
    // console.log('imageUri ', imageUri ? true : false)
    //height = <user-chosen width> * original height / original width
    return (
      (imageUri && width && height) ?
      <Image 
        source={{ 
          uri: imageUri
        }}
        style={[{
          width: width > windowWidth ? windowWidth : width,
          height: windowWidth * height / width
        }, style]}    
        {...otherProps} 
      /> 
      :
      null
    )
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
