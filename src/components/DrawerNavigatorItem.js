import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
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
    color: 'rgba(0, 0, 0, .87)',
    backgroundColor: 'transparent',
  },
  label: {
    margin: 16,
    fontWeight: 'bold',
    color: 'rgba(0, 0, 0, .87)',
  },
});

const DrawerNavigatorItem = ({ label, icon, onPress }) =>
  <PXTouchable onPress={onPress} delayPressIn={0}>
    <View style={styles.item}>
      {icon
        ? <View style={styles.iconContainer}>
            {React.cloneElement(icon, {
              style: styles.icon,
            })}
          </View>
        : null}
      {typeof label === 'string'
        ? <Text style={styles.label}>
            {label}
          </Text>
        : label}
    </View>
  </PXTouchable>;

export default DrawerNavigatorItem;
