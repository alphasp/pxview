import React from 'react';
import { View, StyleSheet } from 'react-native';
import Spinner from 'react-native-spinkit';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  absolutePosition: {
    position: 'absolute',
    top: '50%',
    bottom: '50%',
    left: '50%',
    right: '50%',
  },
});

const Loader = ({ absolutePosition, style }) =>
  <View
    style={[
      styles.container,
      absolutePosition && styles.absolutePosition,
      style,
    ]}
  >
    <Spinner type="ThreeBounce" />
  </View>;

export default Loader;
