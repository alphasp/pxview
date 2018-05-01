import React from 'react';
import { StyleSheet } from 'react-native';
import { Badge } from 'react-native-elements';

const styles = StyleSheet.create({
  badge: {
    backgroundColor: '#F8A128',
    borderRadius: 5,
    padding: 10,
  },
});

const PremiumBadge = ({ containerStyle, ...restProps }) =>
  <Badge
    value="P"
    containerStyle={[styles.badge, containerStyle]}
    {...restProps}
  />;

export default PremiumBadge;
