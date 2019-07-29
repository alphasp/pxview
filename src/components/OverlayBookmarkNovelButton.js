import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import BookmarkNovelButton from './BookmarkNovelButton';

const styles = StyleSheet.create({
  container: {
    bottom: 0,
    right: 0,
    position: 'absolute',
    justifyContent: 'center',
    paddingHorizontal: 5,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
  },
  gridViewContainer: {
    backgroundColor: 'rgba(0,0,0,0)',
  },
  listViewContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    left: 0,
  },
  bookmarkCount: {
    marginRight: 5,
    color: '#fff',
  },
});

const OverlayBookmarkNovelButton = ({ total, gridView, ...restProps }) => (
  <View
    style={[
      styles.container,
      gridView ? styles.gridViewContainer : styles.listViewContainer,
    ]}
  >
    {total > 0 && <Text style={styles.bookmarkCount}>{total}</Text>}

    <BookmarkNovelButton {...restProps} />
  </View>
);

export default OverlayBookmarkNovelButton;
