import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  RefreshControl,
  Dimensions,
} from 'react-native';
// import Image from 'react-native-image-progress';
import CacheableImage from 'react-native-cacheable-image';
import FitImage from 'react-native-fit-image';
import RNFetchBlob from 'react-native-fetch-blob'
var task;
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

class PXImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageBase64String: null
    }
  }
  componentDidMount() {
    const { uri, onFoundImageSize } = this.props;
    task = RNFetchBlob.fetch('GET', uri, {
      referer: "http://www.pixiv.net"
    })
    task.then(res => {
      if (!this.unmounting) {
        let base64Str = res.base64();
        Image.getSize(`data:image/png;base64,${base64Str}`, (width, height) => {
          if (!this.unmounting) {
            this.setState({width, height});
            if (onFoundImageSize) {
              onFoundImageSize(width, height);
            }
          }
        });
        this.setState({
          imageBase64String: `data:image/png;base64,${base64Str}`
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
    if (task) {
      task.cancel();
    }
  }
  render() {
    const { style, ...otherProps } = this.props;
    const { imageBase64String, width, height } = this.state;
    // console.log('imageBase64String ', imageBase64String ? true : false)
    //height = <user-chosen width> * original height / original width
    return (
      (imageBase64String && width && height) ?
      <Image 
        source={{ 
          uri: imageBase64String
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
    //   imageBase64String ?
    //   <Image 
    //     source={{ 
    //       uri: imageBase64String
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
