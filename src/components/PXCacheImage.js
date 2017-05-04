import React, { Component } from 'react';
import { View, Image, Dimensions, Platform } from 'react-native';
import moment from 'moment';
import RNFetchBlob from 'react-native-fetch-blob';

const windowWidth = Dimensions.get('window').width;

class PXCacheImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageUri: null,
    };
  }

  componentDidMount() {
    const { uri, onFoundImageSize } = this.props;
    this.task = RNFetchBlob.config({
      fileCache: true,
      appendExt: 'png',
      key: uri,
      session: moment().startOf('day').format('YYYY-MM-DD'),
    }).fetch('GET', uri, {
      referer: 'http://www.pixiv.net',
      //'Cache-Control' : 'no-store'
    });
    this.task
      .then(res => {
        if (!this.unmounting) {
          // const base64Str = `data:image/png;base64,${res.base64()}`;
          const filePath = Platform.OS === 'android'
            ? `file://${res.path()}`
            : `${res.path()}`;
          Image.getSize(filePath, (width, height) => {
            if (!this.unmounting) {
              this.setState({ width, height });
              if (onFoundImageSize) {
                onFoundImageSize(width, height, filePath);
              }
            }
          });
          this.setState({
            imageUri: filePath,
          });
        }
      })
      .catch((err, statusCode) => {
        // error handling
        console.log('error fetch blob ', err, statusCode);
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
    // height = <user-chosen width> * original height / original width
    return imageUri && width && height
      ? <View
          style={{
            width: windowWidth,
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#fff',
          }}
        >
          <Image
            source={{
              uri: imageUri,
            }}
            style={[
              {
                width: width > windowWidth ? windowWidth : width,
                height: windowWidth * height / width,
              },
              style,
            ]}
            {...otherProps}
          />
        </View>
      : null;
  }
}

export default PXCacheImage;
