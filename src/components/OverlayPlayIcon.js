import React from 'react';
import { View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginTop: 5,
  },
  icon: {
    backgroundColor: 'transparent',
  },
});

const OverlayPlayIcon = () =>
  <View style={styles.container}>
    <Icon name="play-circle" size={80} style={styles.icon} />
  </View>;

export default OverlayPlayIcon;
