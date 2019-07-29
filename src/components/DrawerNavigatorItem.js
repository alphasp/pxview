import React from 'react';
import { View, StyleSheet } from 'react-native';
import { withTheme, Text } from 'react-native-paper';
import PXTouchable from './PXTouchable';

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginHorizontal: 16,
    width: 24,
    alignItems: 'center',
    opacity: 0.62,
  },
  icon: {
    backgroundColor: 'transparent',
  },
  label: {
    margin: 16,
    fontWeight: 'bold',
  },
});

const DrawerNavigatorItem = ({ label, icon, onPress, theme }) => (
  <PXTouchable onPress={onPress} delayPressIn={0}>
    <View style={styles.item}>
      {icon ? (
        <View style={styles.iconContainer}>
          {React.cloneElement(icon, {
            style: [styles.icon, { color: theme.colors.text }],
          })}
        </View>
      ) : null}
      {typeof label === 'string' ? (
        <Text style={styles.label}>{label}</Text>
      ) : (
        label
      )}
    </View>
  </PXTouchable>
);

export default withTheme(DrawerNavigatorItem);
