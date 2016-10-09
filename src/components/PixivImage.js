import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  RefreshControl,
} from 'react-native';
// import Image from 'react-native-image-progress';
import CacheableImage from 'react-native-cacheable-image';
import RNFetchBlob from 'react-native-fetch-blob'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  cardImage: {
    resizeMode: 'contain',
    margin: 5,
    height: 100
  },
});

class PixivImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageBase64String: null
    }
  }
  componentDidMount() {
    const { source } = this.props;
    RNFetchBlob.fetch('GET', source, {
      referer: "http://www.pixiv.net"
    })
    // when response status code is 200
    .then(res => {
      let base64Str = res.base64();
      this.setState({
        imageBase64String: `data:image/png;base64,${base64Str}`
      })
    })
    // Status code is not 200
    .catch((err, statusCode) => {
      // error handling
      console.log('error fetch blob ', err)
    })
  }
  render() {
    const { source, style, ...otherProps } = this.props;
    const { imageBase64String } = this.state;
    return (
      imageBase64String ?
      <Image 
        source={{ 
          uri: imageBase64String
        }}
        style={ style }     
      /> 
      :
      null
    )
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

export default PixivImage;
