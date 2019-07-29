import React from 'react';
import { View, StyleSheet } from 'react-native';
import { withTheme, Text } from 'react-native-paper';
import IonicIcon from 'react-native-vector-icons/Ionicons';
import PXTouchable from './PXTouchable';

const styles = StyleSheet.create({
  bottomSheetListItem: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 48,
  },
  bottomSheetCancelIcon: {
    marginLeft: 3,
  },
  bottomSheetCancelText: {
    marginLeft: 36,
  },
});

const PXBottomSheetCancelButton = ({ onPress, text, textStyle, theme }) => (
  <PXTouchable onPress={onPress}>
    <View style={styles.bottomSheetListItem}>
      <IonicIcon
        name="md-close"
        size={24}
        style={styles.bottomSheetCancelIcon}
        color={theme.colors.text}
      />
      <Text style={[styles.bottomSheetCancelText, textStyle]}>{text}</Text>
    </View>
  </PXTouchable>
);

export default withTheme(PXBottomSheetCancelButton);
