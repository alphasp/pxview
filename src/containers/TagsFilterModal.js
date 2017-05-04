import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  Text,
  FlatList,
  TouchableWithoutFeedback,
  Modal,
} from 'react-native';
import { connect } from 'react-redux';
import PXTouchable from '../components/PXTouchable';
import * as bookmarkTagsActionCreators from '../common/actions/bookmarkTags';

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
    //padding: 20
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
    backgroundColor: '#5cafec',
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

  componentDidMount() {
    const { fetchBookmarkTags, clearBookmarkTags, tagType } = this.props;
    clearBookmarkTags(tagType);
    fetchBookmarkTags(tagType);
  }

  renderItem = ({ item }) => {
    // const { target, duration } = this.state;
    const { tag, onSelectTag } = this.props;
    const isSelected = item.value === tag;
    return (
      <PXTouchable key={item.name} onPress={() => onSelectTag(item.value)}>
        <View style={[styles.row, isSelected && styles.selectedTagContainer]}>
          {
            <View style={styles.selectedTag}>
              <Text style={isSelected && styles.selectedTagText}>
                {item.name}
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

  loadMoreItems = () => {
    const {
      bookmarkTags: { nextUrl, loading },
      fetchBookmarkTags,
      tagType,
    } = this.props;
    if (!loading && nextUrl) {
      console.log('load more ', nextUrl);
      fetchBookmarkTags(tagType, nextUrl);
    }
  };

  render() {
    const {
      bookmarkTags: { items, loading, loaded },
      onSelectTag,
      isOpen,
      onPressCloseButton,
    } = this.props;
    return (
      <View>
        <Modal
          animationType="fade"
          transparent
          visible={isOpen}
          onRequestClose={onPressCloseButton}
          onShow={() => console.log('on show modal')}
        >
          <PXTouchable style={styles.container} onPress={onPressCloseButton}>
            <TouchableWithoutFeedback>
              <View>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionHeaderTitle}>
                    Collection Tags
                  </Text>
                </View>
                <View style={styles.innerContainer}>
                  <FlatList
                    data={items}
                    keyExtractor={(item, index) => item.name}
                    renderItem={this.renderItem}
                    keyboardShouldPersistTaps="always"
                    onEndReachedThreshold={0.1}
                    onEndReached={this.loadMoreItems}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </PXTouchable>
        </Modal>
      </View>
    );
  }
}

export default connect(
  (state, props) => ({
    bookmarkTags: state.bookmarkTags[props.tagType],
  }),
  bookmarkTagsActionCreators,
)(TagsFilterModal);
