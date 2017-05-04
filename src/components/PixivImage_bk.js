import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, RefreshControl } from 'react-native';
// import Image from 'react-native-image-progress';
// import CacheableImage from 'react-native-cacheable-image';
import FitImage from 'react-native-fit-image';
import RNFetchBlob from 'react-native-fetch-blob';
let task;

class PXImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageBase64String: null,
    };
  }
  componentDidMount() {
    const { source } = this.props;
    task = RNFetchBlob.fetch('GET', source, {
      referer: 'http://www.pixiv.net',
    });
    task
      .then(res => {
        if (!this.unmounting) {
          const base64Str = res.base64();
          this.setState({
            imageBase64String: `data:image/png;base64,${base64Str}`,
          });
        }
      })
      .catch((err, statusCode) => {
        // error handling
        console.log('error fetch blob ', err);
      });
  }
  componentWillUnmount() {
    this.unmounting = true;
    if (task) {
      task.cancel();
    }
  }
  render() {
    const { source, style, ...otherProps } = this.props;
    const { imageBase64String } = this.state;
    console.log('imageBase64String ', !!imageBase64String);
    return imageBase64String
      ? <FitImage
          source={{
            uri: imageBase64String,
          }}
          style={style}
          {...otherProps}
        />
      : null;
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
