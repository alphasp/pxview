import React from 'react';
import { View, StyleSheet } from 'react-native';
import { withTheme, Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import { connectLocalization } from './Localization';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginTop: 5,
  },
});

const OverlayMutedIndicator = ({ i18n, theme }) => (
  <View style={styles.container}>
    <Icon name="ban" size={30} color={theme.colors.text} />
    <Text style={styles.text}>{i18n.tagMuted}</Text>
  </View>
);

export default withTheme(connectLocalization(OverlayMutedIndicator));
