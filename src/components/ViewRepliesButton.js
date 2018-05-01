import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { connectLocalization } from './Localization';
import PXTouchable from './PXTouchable';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  viewRepliesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
  },
  chevronIcon: {
    marginLeft: 5,
  },
});

const ViewRepliesButton = ({ i18n, onPress }) =>
  <View style={styles.container}>
    <PXTouchable onPress={onPress}>
      <View style={styles.viewRepliesContainer}>
        <Text>
          {i18n.commentViewReplies}
        </Text>
        <Icon name="chevron-down" style={styles.chevronIcon} />
      </View>
    </PXTouchable>
  </View>;

export default connectLocalization(ViewRepliesButton);
