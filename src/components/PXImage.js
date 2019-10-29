import React, { PureComponent } from 'react';
import FastImage from 'react-native-fast-image'

class PXImage extends PureComponent {
  render() {
    const { style, uri, ...otherProps } = this.props;
    return (
      <FastImage
        source={{
          uri,
          headers: {
            referer: 'http://www.pixiv.net',
          },
        }}
        style={style}
        {...otherProps}
      />
    );
  }
}

export default PXImage;
