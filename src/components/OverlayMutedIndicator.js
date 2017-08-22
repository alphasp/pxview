import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
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

const OverlayMutedIndicator = ({ i18n }) =>
  <View style={styles.container}>
    <Icon name="ban" size={30} />
    <Text style={styles.text}>
      {i18n.tagMuted}
    </Text>
  </View>;

export default connectLocalization(OverlayMutedIndicator);
