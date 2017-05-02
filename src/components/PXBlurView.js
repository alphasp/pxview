import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  Platform,
  findNodeHandle,
} from 'react-native';
import { BlurView } from 'react-native-blur';
import PXImage from './PXImage';

class PXBlurView extends Component {
  render() {
    const { children, ...restProps } = this.props;
    console.log('children ', children);
    if (Platform.OS === 'android') {
      return (
        <View>
          <BlurView {...restProps} />
          {children}
        </View>
      );
    }

    return (
      <BlurView {...restProps}>
        {children}
      </BlurView>
    );
  }
}

export default PXBlurView;
