import React from 'react';
import { StyleSheet, View } from 'react-native';
import { withTheme, Text } from 'react-native-paper';
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

const ViewRepliesButton = ({ i18n, onPress, theme }) =>
  <View style={styles.container}>
    <PXTouchable
      hitSlop={{ top: 0, left: 20, bottom: 20, right: 20 }}
      onPress={onPress}
    >
      <View style={styles.viewRepliesContainer}>
        <Text>
          {i18n.commentViewReplies}
        </Text>
        <Icon
          name="chevron-down"
          style={styles.chevronIcon}
          color={theme.colors.text}
        />
      </View>
    </PXTouchable>
  </View>;

export default withTheme(connectLocalization(ViewRepliesButton));
