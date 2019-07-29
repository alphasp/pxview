import React from 'react';
import { StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import PXTouchable from './PXTouchable';

const styles = StyleSheet.create({
  icon: {
    padding: 10,
    color: '#fff',
  },
});

const HeaderShareButton = ({ onPress, ...restProps }) => (
  <PXTouchable onPress={onPress} {...restProps}>
    <Icon name="share" size={20} style={styles.icon} />
  </PXTouchable>
);

export default HeaderShareButton;
