import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
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
  text: {
    marginLeft: 3,
    color: '#fff',
    fontSize: 12,
  },
});

const OverlayBookmarkNovelButton = ({ total, gridView, ...restProps }) =>
  <View
    style={[
      styles.container,
      gridView ? styles.gridViewContainer : styles.listViewContainer,
    ]}
  >
    <BookmarkNovelButton {...restProps} />
    {!gridView &&
      total &&
      <Text style={styles.text}>
        {total}
      </Text>}
  </View>;

export default OverlayBookmarkNovelButton;
