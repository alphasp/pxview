import React from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import PXTouchable from './PXTouchable';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    //flex: 1,
    // flexDirection: 'row',
  },
  tagContainer: {
    // backgroundColor: 'red',
    // margin: 3,
    // borderRadius: 30,
    justifyContent: 'center',
    backgroundColor: '#5cafec',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#5cafec',
    paddingHorizontal: 2,
    // height: 32,
    margin: 4,
  },
  tagLabelContainer: {
    flexDirection: 'row',
    padding: 2,
  },
  tagLabel: {
    color: '#fff',
  },
  removeButtonContainer: {
    marginLeft: 4,
    borderLeftWidth: 1,
    borderLeftColor: '#fff',
  },
  removeButtonText: {
    marginLeft: 4,
    color: '#fff',
  },
});

const SearchTags = props => {
  const { tags, onPressTag, onPressRemove } = props;
  // const tags = ['abcd', 'def', 'gg']
  return (
    <View style={styles.container}>
      <ScrollView horizontal keyboardShouldPersistTaps="always">
        {tags.map((tag, index) => (
          <View key={index} style={styles.tagContainer}>
            <View style={styles.tagLabelContainer}>
              <Text style={styles.tagLabel}>{tag}</Text>
              <View style={styles.removeButtonContainer}>
                <PXTouchable onPress={() => onPressRemove(index)}>
                  <Text style={styles.removeButtonText}>X</Text>
                </PXTouchable>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default SearchTags;
