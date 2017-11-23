import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BookmarkNovelButton from './BookmarkNovelButton';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    bottom: 0,
    right: 0,
    position: 'absolute',
    justifyContent: 'center',
    paddingHorizontal: 5,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
  },
  text: {
    marginLeft: 3,
    color: '#fff',
    backgroundColor: 'transparent',
  },
});

const OverlayBookmarkNovelButton = ({ total, ...restProps }) =>
  <View style={styles.container}>
    <BookmarkNovelButton {...restProps} />
    <Text style={styles.text}>
      {total}
    </Text>
  </View>;

export default OverlayBookmarkNovelButton;
