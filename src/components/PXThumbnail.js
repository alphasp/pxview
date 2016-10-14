import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import PXImage from './PXImage';

const PXThumbnail = (props) => {
  const { uri, size, style, ...otherProps } = props;
  return (
    <PXImage
      uri={uri}  
      style={[{
        resizeMode: "contain",
        borderRadius: size ? size / 2 : 15,
        width: size || 30,
        height: size || 30
      }, style]} 
      { ...otherProps }
    />
  );
}

export default PXThumbnail;
