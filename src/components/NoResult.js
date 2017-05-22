import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  nullResultContainer: {
    flex: 1,
    alignItems: 'center',
  },
});

const NoResult = ({ text }) => (
  <View style={styles.nullResultContainer}>
    <Text>{text}</Text>
  </View>
);

export default NoResult;
