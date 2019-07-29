import React from 'react';
import { StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import PXTouchable from './PXTouchable';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
});

const PXListItemRemoveButton = ({
  size = 28,
  color = '#bdc6cf',
  onPress,
  ...restProps
}) => (
  <PXTouchable
    hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
    style={styles.container}
    onPress={onPress}
    {...restProps}
  >
    <Icon name="times" size={size} color={color} />
  </PXTouchable>
);

export default PXListItemRemoveButton;
