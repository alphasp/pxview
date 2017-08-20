import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import PXTouchable from './PXTouchable';
import { globalStyleVariables } from '../styles';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  tagContainer: {
    justifyContent: 'center',
    backgroundColor: globalStyleVariables.PRIMARY_COLOR,
    borderRadius: 15,
    paddingHorizontal: 12,
    margin: 4,
  },
  tagLabel: {
    padding: 2,
    color: '#fff',
  },
});

const Tags = ({ tags, onPressTag, onLongPressTag }) =>
  <View style={styles.container}>
    {tags.map(tag =>
      <PXTouchable
        key={tag.name}
        style={styles.tagContainer}
        onPress={() => onPressTag(tag.name)}
        onLongPress={() => onLongPressTag(tag.name)}
      >
        <Text style={styles.tagLabel}>
          {tag.name}
        </Text>
      </PXTouchable>,
    )}
  </View>;

export default Tags;
