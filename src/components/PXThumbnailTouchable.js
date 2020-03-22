import React from 'react';
import PXTouchable from './PXTouchable';
import PXThumbnail from './PXThumbnail';

const PXThumbnailTouchable = (props) => {
  const { uri, size, style, thumbnailStyle, onPress, ...otherProps } = props;
  return (
    <PXTouchable
      style={[
        style,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
      ]}
      onPress={onPress}
      {...otherProps}
    >
      <PXThumbnail uri={uri} size={size} style={thumbnailStyle} />
    </PXTouchable>
  );
};

PXThumbnailTouchable.defaultProps = {
  size: 30,
};

export default PXThumbnailTouchable;
