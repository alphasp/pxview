/* eslint-disable camelcase */

import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
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
    color: '#fff',
  },
});

const OverlayBookmarkIllustButton = (props) => {
  const { item, isShowLikeCount } = props;
  const showLikeCount = isShowLikeCount && item.total_bookmarks > 0;
  return (
    <View style={styles.container}>
      {showLikeCount && (
        <Text style={styles.bookmarkCount}>{item.total_bookmarks}</Text>
      )}
      <BookmarkIllustButton {...props} />
    </View>
  );
};

export default OverlayBookmarkIllustButton;
