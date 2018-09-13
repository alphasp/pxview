import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import { withTheme, Text } from 'react-native-paper';
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
  theme,
}) =>
  <PXTouchable onPress={onPress}>
    <View style={styles.bottomSheetListItem}>
      {iconName &&
        iconType &&
        <Icon
          name={iconName}
          type={iconType}
          size={iconSize || 24}
          color={theme.colors.text}
        />}

      <Text style={[styles.bottomSheetText, textStyle]}>
        {text}
      </Text>
    </View>
  </PXTouchable>;

export default withTheme(PXBottomSheetButton);
