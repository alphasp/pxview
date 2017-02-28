import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import PXImage from './PXImage';

const defaultSize = 30;

const PXThumbnail = (props) => {
  const { uri, size, style, ...otherProps } = props;
  return (
    <PXImage
      uri={uri}  
      style={[{
        resizeMode: "cover",
        borderRadius: size ? size / 2 : defaultSize / 2,
        width: size || defaultSize,
        height: size || defaultSize,
        backgroundColor: '#E9EBEE',
      }, style]} 
      { ...otherProps }
    />
  );
}

export default PXThumbnail;
