import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Platform,
  Image,
} from 'react-native';
import moment from 'moment';
import PhotoView from 'react-native-photo-view';
import RNFetchBlob from 'react-native-fetch-blob';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

class PXPhotoView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageUri: null,
    };
  }

  componentDidMount() {
    const { uri } = this.props;
    this.task = RNFetchBlob
      .config({
        // fileCache : true,
        // appendExt: 'png',
        // key: uri,
        // session: moment().startOf('day'),
      }).fetch('GET', uri, {
        referer: 'http://www.pixiv.net',
      });
    this.task.then(res => {
      if (!this.unmounting) {
        // base64 working fine
        const base64Str = `data:image/png;base64,${res.base64()}`;
        // const filePath = Platform.OS === 'android' ? 'file://' + res.path()  : '' + res.path();
        this.setState({
          imageUri: base64Str,
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
    if (this.task) {
      this.task.cancel();
    }
  }

  render() {
    const { uri, ...otherProps } = this.props;
    const { imageUri } = this.state;
    return (
      imageUri ?
        <PhotoView
          source={{
            uri: imageUri,
          }}
          {...otherProps}
        />
      :
      null
    );
  }
}

export default PXPhotoView;
