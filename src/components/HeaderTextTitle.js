import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: Platform.OS === 'android' ? 'flex-start' : 'center',
  },
  text: {
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
    marginHorizontal: 16,
    color: '#fff',
  },
});

const HeaderTextTitle = ({ children }) =>
  <View style={styles.container}>
    <Text style={styles.text}>
      {children}
    </Text>
  </View>;

export default HeaderTextTitle;
