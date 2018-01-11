import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableWithoutFeedback,
  Modal,
} from 'react-native';
import { connectLocalization } from '../components/Localization';
import PXTouchable from '../components/PXTouchable';
import { globalStyleVariables } from '../styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 80,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  innerContainer: {
    // borderRadius: 10,
    // alignItems: 'center',
    backgroundColor: '#fff',
    // padding: 20
  },
  sectionHeader: {
    backgroundColor: '#E9EBEE',
  },
  sectionHeaderTitle: {
    fontWeight: 'bold',
    // fontSize: 20,
    padding: 10,
  },
  row: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  selectedTagContainer: {
    backgroundColor: globalStyleVariables.PRIMARY_COLOR,
  },
  selectedTagText: {
    color: '#fff',
  },
});

class TagsFilterModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tag: 'all',
    };
  }

  renderItem = ({ item }) => {
    // const { target, duration } = this.state;
    const { tag, onSelectTag, i18n } = this.props;
    const isSelected = item.value === tag;
    let tagName;
    if (item.value === '') {
      tagName = i18n.collectionTagsAll;
    } else if (item.value === '未分類') {
      tagName = i18n.collectionTagsUncategorized;
    } else {
      tagName = item.name;
    }
    return (
      <PXTouchable key={item.name} onPress={() => onSelectTag(item.value)}>
        <View style={[styles.row, isSelected && styles.selectedTagContainer]}>
          {
            <View style={styles.selectedTag}>
              <Text style={isSelected && styles.selectedTagText}>
                {tagName}
              </Text>
            </View>
          }
          {item.count &&
            <Text style={isSelected && styles.selectedTagText}>
              {item.count}
            </Text>}
        </View>
      </PXTouchable>
    );
  };

  render() {
    const {
      items,
      isOpen,
      onPressCloseButton,
      i18n,
      onEndReached,
    } = this.props;
    return (
      <Modal
        animationType="fade"
        transparent
        visible={isOpen}
        onRequestClose={onPressCloseButton}
      >
        <TouchableWithoutFeedback onPress={onPressCloseButton}>
          <View style={styles.container}>
            <TouchableWithoutFeedback>
              <View>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionHeaderTitle}>
                    {i18n.collectionTags}
                  </Text>
                </View>
                <View style={styles.innerContainer}>
                  <FlatList
                    data={items}
                    keyExtractor={item => item.name}
                    renderItem={this.renderItem}
                    keyboardShouldPersistTaps="always"
                    onEndReachedThreshold={0.1}
                    onEndReached={onEndReached}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }
}

export default connectLocalization(TagsFilterModal);
