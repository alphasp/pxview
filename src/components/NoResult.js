import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  nullResultContainer: {
    flex: 1,
    alignItems: 'center',
  },
});

const NoResult = ({ text, style }) =>
  <View style={[styles.nullResultContainer, style]}>
    <Text>
      {text}
    </Text>
  </View>;

export default NoResult;
