import React from 'react';
import { View, StyleSheet } from 'react-native';
import BookmarkIllustButton from '../components/BookmarkIllustButton';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    bottom: 0,
    right: 0,
    position: 'absolute',
    justifyContent: 'center',
    paddingHorizontal: 5,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
  },
});

const OverlayBookmarkButton = props =>
  <View style={styles.container}>
    <BookmarkIllustButton {...props} />
  </View>;

export default OverlayBookmarkButton;
