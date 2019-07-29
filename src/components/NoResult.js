import React from 'react';
import { View, StyleSheet } from 'react-native';
import { withTheme, Text } from 'react-native-paper';

const styles = StyleSheet.create({
  nullResultContainer: {
    flex: 1,
    alignItems: 'center',
  },
});

const NoResult = ({ text, style }) => (
  <View style={[styles.nullResultContainer, style]}>
    <Text>{text}</Text>
  </View>
);

export default withTheme(NoResult);
