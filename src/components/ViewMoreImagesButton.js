import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { connectLocalization } from './Localization';
import PXTouchable from './PXTouchable';
import { globalStyleVariables } from '../styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'center',
    backgroundColor: globalStyleVariables.PRIMARY_COLOR,
    borderRadius: 15,
    padding: 12,
    margin: 10,
  },
  text: {
    color: '#fff',
  },
});

const ViewMoreImagesButton = ({ i18n, onPress }) =>
  <View style={styles.container}>
    <PXTouchable onPress={onPress}>
      <Text style={styles.text}>
        {i18n.viewMore}
      </Text>
    </PXTouchable>
  </View>;

export default connectLocalization(ViewMoreImagesButton);
