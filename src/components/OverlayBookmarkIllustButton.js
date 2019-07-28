/* eslint-disable camelcase */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import BookmarkIllustButton from './BookmarkIllustButton';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    bottom: 0,
    right: 0,
    position: 'absolute',
    justifyContent: 'center',
    paddingHorizontal: 5,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
  },
  bookmarkCount: {
    marginRight: 5,
  },
});

const OverlayBookmarkIllustButton = props => {
  const { item } = props;
  return (
    <View style={styles.container}>
      {item.total_bookmarks > 0 &&
        <Text style={styles.bookmarkCount}>
          {item.total_bookmarks}
        </Text>}
      <BookmarkIllustButton {...props} />
    </View>
  );
};

export default OverlayBookmarkIllustButton;
