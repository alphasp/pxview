import React from 'react';
import { View } from 'react-native';
import PXImage from './PXImage';
import { globalStyleVariables } from '../styles';

const PXThumbnail = props => {
  const { uri, size, style, ...otherProps } = props;
  return (
    <View
      style={{
        backgroundColor: globalStyleVariables.BACKGROUND_COLOR,
        borderRadius: size / 2,
        overflow: 'hidden',
        width: size,
        height: size,
      }}
    >
      <PXImage
        uri={uri}
        style={[
          {
            resizeMode: 'cover',
            width: size,
            height: size,
            borderRadius: size / 2,
          },
          style,
        ]}
        {...otherProps}
      />
    </View>
  );
};

PXThumbnail.defaultProps = {
  size: 30,
};

export default PXThumbnail;
