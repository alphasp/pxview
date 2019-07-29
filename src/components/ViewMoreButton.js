import React from 'react';
import { StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { withTheme, Text } from 'react-native-paper';
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
    padding: 10,
  },
  chevronIcon: {
    marginLeft: 5,
  },
});

const ViewMoreButton = ({ i18n, onPress, theme }) => (
  <View
    style={[styles.container, { backgroundColor: theme.colors.background }]}
  >
    <PXTouchable onPress={onPress}>
      <View style={styles.viewMoreContainer}>
        <Text>{i18n.viewMore}</Text>
        <Icon
          name="chevron-down"
          style={styles.chevronIcon}
          color={theme.colors.text}
        />
      </View>
    </PXTouchable>
  </View>
);

export default withTheme(connectLocalization(ViewMoreButton));
