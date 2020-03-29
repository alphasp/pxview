import React from 'react';
import { Icon } from 'react-native-elements';

const DrawerIcon = ({ name, type, color, size, ...restProps }) => (
  <Icon
    name={name}
    size={24}
    type={type || 'font-awesome'}
    color={color}
    {...restProps}
  />
);

export default DrawerIcon;
