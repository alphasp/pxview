import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
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

const PXBottomSheetCancelButton = ({ onPress, text, textStyle }) =>
  <PXTouchable onPress={onPress}>
    <View style={styles.bottomSheetListItem}>
      <IonicIcon
        name="md-close"
        size={24}
        style={styles.bottomSheetCancelIcon}
      />
      <Text style={[styles.bottomSheetCancelText, textStyle]}>
        {text}
      </Text>
    </View>
  </PXTouchable>;

export default PXBottomSheetCancelButton;
