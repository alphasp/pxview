import React from 'react';
import { StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import PXTouchable from './PXTouchable';

const styles = StyleSheet.create({
  icon: {
    paddingVertical: 10,
    paddingLeft: 10,
    paddingRight: 20,
  },
});

const HeaderSettingsButton = ({ onPress, color, style, ...restProps }) => (
  <PXTouchable onPress={onPress} style={style} {...restProps}>
    <Icon name="cog" size={20} style={styles.icon} color={color || '#fff'} />
  </PXTouchable>
);

export default HeaderSettingsButton;
