import React from 'react';
import { View, StyleSheet } from 'react-native';
import PXImage from './PXImage';

const defaultSize = 30;

const PXThumbnail = props => {
  const { uri, size, style, ...otherProps } = props;
  return (
    <View
      style={{
        backgroundColor: '#E9EBEE',
        borderRadius: size ? size / 2 : defaultSize / 2,
        overflow: 'hidden',
      }}
    >
      <PXImage
        uri={uri}
        style={[
          {
            resizeMode: 'cover',
            width: size || defaultSize,
            height: size || defaultSize,
            borderRadius: size ? size / 2 : defaultSize / 2,
          },
          style,
        ]}
        {...otherProps}
      />
    </View>
  );
};

export default PXThumbnail;
