import React, { PureComponent } from 'react';
import { Image } from 'react-native';

class PXImage extends PureComponent {
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
        onError={e => console.log('fail to load image ', e.nativeEvent.error)}
        style={style}
        {...otherProps}
      />
    );
  }
}

export default PXImage;
