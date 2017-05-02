import React, { Component } from 'react';
import PXTouchable from './PXTouchable';
import PXThumbnail from './PXThumbnail';

const defaultSize = 30;

class PXThumbnailTouchable extends Component {
  render() {
    const { uri, size, style, thumbnailStyle, onPress, ...otherProps } = this.props;
    return (
      <PXTouchable
        style={[style, {
          width: size || defaultSize,
          height: size || defaultSize,
          borderRadius: size ? size / 2 : defaultSize / 2,
        }]}
        onPress={onPress}
        {...otherProps}
      >
        <PXThumbnail
          uri={uri}
          size={size || defaultSize}
          style={thumbnailStyle}
        />
      </PXTouchable>
    );
  }
}

export default PXThumbnailTouchable;
