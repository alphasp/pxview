import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  FlatList,
  TouchableWithoutFeedback,
  Modal,
  Switch,
  Keyboard,
  Dimensions,
} from 'react-native';
import { connect } from 'react-redux';
import { MKCheckbox } from 'react-native-material-kit';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Toast, { DURATION } from 'react-native-easy-toast';
import PXTouchable from '../components/PXTouchable';
import * as illustBookmarkDetailActionCreators
  from '../common/actions/illustBookmarkDetail';
import * as bookmarkIllustActionCreators
  from '../common/actions/bookmarkIllust';
import * as modalActionCreators from '../common/actions/modal';
import { BOOKMARK_TYPES } from '../common/constants';

const MAX_TAGS_COUNT = 10;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  innerContainer: {
    // borderRadius: 10,
    // alignItems: 'center',
    backgroundColor: '#fff',
    //padding: 20
  },
  titleContainer: {
    backgroundColor: '#E9EBEE',
    padding: 10,
  },
  title: {
    fontWeight: 'bold',
    // fontSize: 20,
  },
  subTitleContainer: {
    paddingTop: 10,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  newTagContainer: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tagInput: {
    height: 40,
    backgroundColor: '#E9EBEE',
    padding: 10,
    flex: 1,
    marginRight: 10,
  },
  actionContainer: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  row: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedTagContainer: {
    backgroundColor: '#5cafec',
  },
  selectedTagText: {
    color: '#fff',
  },
  tagText: {
    fontSize: 12,
    flex: 1, //wrap text
  },
});

class BookmarkModal extends Component {
  static propTypes = {
    illustId: PropTypes.number.isRequired,
    isBookmark: PropTypes.bool.isRequired,
    fetchIllustBookmarkDetail: PropTypes.func.isRequired,
    clearIllustBookmarkDetail: PropTypes.func.isRequired,
    bookmarkIllust: PropTypes.func.isRequired,
    unbookmarkIllust: PropTypes.func.isRequired,
    closeModal: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      tags: [],
      isPrivate: false,
      selectedTagsCount: 0,
      newTag: null,
    };
  }

  componentDidMount() {
    const {
      illustId,
      fetchIllustBookmarkDetail,
      clearIllustBookmarkDetail,
    } = this.props;
    clearIllustBookmarkDetail(illustId);
    fetchIllustBookmarkDetail(illustId);
  }

  componentWillReceiveProps(nextProps) {
    const { illustBookmarkDetail: { item: prevItem } } = this.props;
    const { illustBookmarkDetail: { item } } = nextProps;
    if (item && item !== prevItem) {
      const selectedTagsCount = this.countSelectedTags(item.tags);
      const tags = item.tags.map(tag => ({
        ...tag,
        editable: !!(tag.is_registered || selectedTagsCount < MAX_TAGS_COUNT),
      }));
      this.setState({
        tags,
        isPrivate: item.restrict === 'private',
        selectedTagsCount,
      });
    }
  }

  handleOnChangeIsPrivate = value => {
    this.setState({
      isPrivate: value,
    });
  };

  handleOnCheckTag = checkedTag => {
    const { tags } = this.state;
    let selectedTagsCount = this.countSelectedTags(tags);
    if (!checkedTag.editable) {
      if (selectedTagsCount > MAX_TAGS_COUNT - 1) {
        this.toast.show(
          `Maximum of tags is ${MAX_TAGS_COUNT}`,
          DURATION.LENGTH_LONG,
        );
      }
      return;
    }
    const selectedTag = tags.find(tag => tag.name === checkedTag.name);
    if (selectedTag) {
      if (selectedTag.is_registered) {
        selectedTagsCount -= 1;
      } else {
        selectedTagsCount += 1;
      }
    }
    console.log('selectedTagsCount ', selectedTagsCount);
    const updatedTags = tags.map(tag => {
      const isRegistered = tag.name === checkedTag.name
        ? !tag.is_registered
        : tag.is_registered;
      return {
        ...tag,
        is_registered: isRegistered,
        editable: !!(selectedTagsCount < MAX_TAGS_COUNT || isRegistered),
      };
    });
    // selectedTagsCount < 3 || item.is_registered) ? true :
    // const selectedTagsCount = this.countSelectedTags(updatedTags);
    this.setState({
      tags: updatedTags,
      selectedTagsCount,
    });
  };

  countSelectedTags = tags =>
    // eslint-disable-next-line no-plusplus
    tags.reduce((count, tag) => (tag.is_registered ? ++count : count), 0);

  handleOnPressBookmarkButton = () => {
    const { illustId } = this.props;
    const { tags, isPrivate } = this.state;
    const selectedTags = tags
      .filter(tag => tag.is_registered)
      .map(tag => tag.name);
    const bookmarkType = isPrivate
      ? BOOKMARK_TYPES.PRIVATE
      : BOOKMARK_TYPES.PUBLIC;
    this.bookmarkIllust(illustId, bookmarkType, selectedTags);
    this.handleOnModalClose();
  };

  handleOnPressRemoveButton = () => {
    const { illustId } = this.props;
    this.unbookmarkIllust(illustId);
    this.handleOnModalClose();
  };

  handleOnModalClose = () => {
    const { closeModal } = this.props;
    closeModal();
  };

  handleOnPressAddTag = () => {
    const { newTag, tags } = this.state;
    if (!newTag) {
      return;
    }
    console.log('add tag ', newTag);
    const isExistingTag = tags.some(tag => tag.name === newTag);
    const newTagEntry = {
      name: newTag,
      is_registered: true,
      editable: true,
    };
    let updatedTags;
    if (isExistingTag) {
      const excludeExistingTagTags = tags.filter(tag => tag.name !== newTag);
      updatedTags = [newTagEntry, ...excludeExistingTagTags];
    } else {
      updatedTags = [newTagEntry, ...tags];
      if (this.countSelectedTags(updatedTags) > MAX_TAGS_COUNT) {
        this.toast.show(
          `Maximum of tags is ${MAX_TAGS_COUNT}`,
          DURATION.LENGTH_LONG,
        );
        this.setState({
          newTag: null,
        });
        return;
      }
    }

    this.setState({
      tags: updatedTags,
      selectedTagsCount: this.countSelectedTags(updatedTags),
      newTag: null,
    });
    this.tagInput.setNativeProps({ text: '' });
  };

  bookmarkIllust = (id, bookmarkType, selectedTags) => {
    const { bookmarkIllust } = this.props;
    bookmarkIllust(id, bookmarkType, selectedTags);
  };

  unbookmarkIllust = id => {
    const { unbookmarkIllust } = this.props;
    unbookmarkIllust(id);
  };

  renderItem = ({ item }) => (
    <PXTouchable onPress={() => this.handleOnCheckTag(item)}>
      <View style={styles.row}>
        <Text style={styles.tagText}>{item.name}</Text>
        <MKCheckbox
          checked={item.is_registered}
          onCheckedChange={() => this.handleOnCheckTag(item)}
          editable={item.editable}
        />
      </View>
    </PXTouchable>
  );

  render() {
    const { isBookmark } = this.props;
    const { tags, selectedTagsCount, isPrivate } = this.state;
    return (
      <Modal
        animationType="fade"
        transparent
        visible
        onRequestClose={this.handleOnModalClose}
      >
        <PXTouchable style={styles.container} onPress={this.handleOnModalClose}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.innerContainer}>
              <View style={styles.titleContainer}>
                <Text style={styles.title}>
                  {isBookmark ? 'Edit Like' : 'Add Like'}
                </Text>
              </View>
              <View style={styles.subTitleContainer}>
                <Text>Collection Tags</Text>
                <Text>{selectedTagsCount} / 10</Text>
              </View>
              <View style={styles.newTagContainer}>
                <TextInput
                  ref={ref => (this.tagInput = ref)}
                  style={styles.tagInput}
                  placeholder="Add tag"
                  autoCorrect={false}
                  onChangeText={text => this.setState({ newTag: text })}
                />
                <PXTouchable onPress={this.handleOnPressAddTag}>
                  <Icon name="plus" size={20} />
                </PXTouchable>
              </View>
              <View
                style={{ maxHeight: Dimensions.get('window').height - 300 }}
              >
                <FlatList
                  data={tags}
                  keyExtractor={item => item.name}
                  renderItem={this.renderItem}
                  keyboardShouldPersistTaps="always"
                />
              </View>
              <View style={styles.row}>
                <Text>Private</Text>
                <Switch
                  value={isPrivate}
                  onValueChange={this.handleOnChangeIsPrivate}
                />
              </View>
              <View
                style={[
                  styles.actionContainer,
                  !isBookmark && { justifyContent: 'center' },
                ]}
              >
                {isBookmark &&
                  <PXTouchable onPress={this.handleOnPressRemoveButton}>
                    <Text>Remove Like</Text>
                  </PXTouchable>}
                <PXTouchable
                  style={
                    !isBookmark && {
                      flexDirection: 'row',
                      alignItems: 'center',
                    }
                  }
                  onPress={this.handleOnPressBookmarkButton}
                >
                  {!isBookmark &&
                    <MaterialIcon
                      name="favorite"
                      color="rgb(210, 212, 216)"
                      size={20}
                    />}
                  <Text>{isBookmark ? 'Save' : 'Like'}</Text>
                </PXTouchable>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </PXTouchable>
        <Toast ref={ref => (this.toast = ref)} />
      </Modal>
    );
  }
}

export default connect(
  state => ({
    illustBookmarkDetail: state.illustBookmarkDetail,
  }),
  {
    ...illustBookmarkDetailActionCreators,
    ...bookmarkIllustActionCreators,
    ...modalActionCreators,
  },
)(BookmarkModal);
