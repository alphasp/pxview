import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableWithoutFeedback,
  Modal,
} from 'react-native';
import { withTheme, Text } from 'react-native-paper';
import { connectLocalization } from './Localization';
import PXTouchable from './PXTouchable';
import { globalStyleVariables } from '../styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 80,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
          <View style={styles.selectedTag}>
            <Text style={isSelected && styles.selectedTagText}>{tagName}</Text>
          </View>
          {item.count ? (
            <Text style={isSelected && styles.selectedTagText}>
              {item.count}
            </Text>
          ) : null}
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
      theme,
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
                <View
                  style={{ backgroundColor: theme.colors.modalTitleBackground }}
                >
                  <Text style={styles.sectionHeaderTitle}>
                    {i18n.collectionTags}
                  </Text>
                </View>
                <View style={{ backgroundColor: theme.colors.background }}>
                  <FlatList
                    data={items}
                    keyExtractor={(item) => item.name}
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

export default withTheme(connectLocalization(TagsFilterModal));
