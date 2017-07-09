import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PXTouchable from './PXTouchable';

const DrawerMenuButton = ({ onPress, color, ...restProps }) =>
  <PXTouchable onPress={onPress} {...restProps}>
    <Icon
      name="menu"
      size={24}
      color={color || '#fff'}
      style={{ margin: 16 }}
    />
  </PXTouchable>;

export default DrawerMenuButton;
