import React, { Component } from 'react';
import PXTouchable from './PXTouchable';
import PXThumbnail from './PXThumbnail';

class PXThumbnailTouchable extends Component {
  render() {
    const { uri, size, style, thumbnailStyle, onPress, ...otherProps } = this.props;
    return (
      <PXTouchable 
        style={[style, {
          width: size || 30,
          height: size || 30,
          borderRadius: size ? size / 2 : 15,
        }]}
        onPress={onPress}
        {...otherProps}
      >
        <PXThumbnail 
          uri={uri}
          size={size || 30}
          style={thumbnailStyle}
        />
      </PXTouchable>
    );
  }
}

export default PXThumbnailTouchable;