import React from 'react';
import { StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import PXTouchable from './PXTouchable';

const styles = StyleSheet.create({
  icon: {
    padding: 10,
  },
});

const HeaderInfoButton = ({ onPress, color, style, ...restProps }) => (
  <PXTouchable onPress={onPress} style={style} {...restProps}>
    <Icon
      name="info-circle"
      size={20}
      style={styles.icon}
      color={color || '#fff'}
    />
  </PXTouchable>
);

export default HeaderInfoButton;
