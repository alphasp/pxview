import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Icon } from 'react-native-elements';
import PXTouchable from './PXTouchable';

const styles = StyleSheet.create({
  bottomSheetListItem: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 48,
  },
  bottomSheetText: {
    marginLeft: 32,
  },
});

const PXBottomSheetButton = ({
  onPress,
  iconName,
  iconType,
  iconSize,
  text,
  textStyle,
}) =>
  <PXTouchable onPress={onPress}>
    <View style={styles.bottomSheetListItem}>
      {iconName &&
        iconType &&
        <Icon name={iconName} type={iconType} size={iconSize || 24} />}

      <Text style={[styles.bottomSheetText, textStyle]}>
        {text}
      </Text>
    </View>
  </PXTouchable>;

export default PXBottomSheetButton;
