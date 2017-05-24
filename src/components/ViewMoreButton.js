import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { connectLocalization } from './Localization';
import PXTouchable from './PXTouchable';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'center',
  },
  viewMoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chevronIcon: {
    marginLeft: 5,
  },
});

const ViewMoreButton = ({ i18n, onPress }) => (
  <View style={styles.container}>
    <PXTouchable onPress={onPress}>
      <View style={styles.viewMoreContainer}>
        <Text>{i18n.viewMore}</Text>
        <Icon name="chevron-down" style={styles.chevronIcon} />
      </View>
    </PXTouchable>
  </View>
);

export default connectLocalization(ViewMoreButton);
