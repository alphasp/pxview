import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableWithoutFeedback,
  Modal,
  Keyboard,
} from 'react-native';
import {
  withTheme,
  Checkbox,
  TouchableRipple,
  Switch,
  Text,
  TextInput,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Toast from 'react-native-easy-toast';
import { connectLocalization } from '../components/Localization';
import PXTouchable from '../components/PXTouchable';
import Separator from '../components/Separator';
import { BOOKMARK_TYPES } from '../common/constants';
import { globalStyleVariables } from '../styles';

const MAX_TAGS_COUNT = 10;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  titleContainer: {
    padding: 10,
  },
  title: {
    fontWeight: 'bold',
  },
  subTitleContainer: {
    paddingTop: 10,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tagsContainer: {
    maxHeight: globalStyleVariables.WINDOW_HEIGHT - 300,
  },
  newTagContainer: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tagInput: {
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
    backgroundColor: globalStyleVariables.PRIMARY_COLOR,
  },
  tagText: {
    fontSize: 12,
    flex: 1, // wrap text
  },
});

class BookmarkModal extends Component {
  static propTypes = {
    id: PropTypes.number.isRequired,
    isBookmark: PropTypes.bool.isRequired,
    onPressBookmark: PropTypes.func.isRequired,
    onPressRemoveBookmark: PropTypes.func.isRequired,
    onModalClose: PropTypes.func.isRequired,
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

  componentDidUpdate(prevProps) {
    const { item } = this.props;
    const { item: prevItem } = prevProps;
    if (item && item !== prevItem) {
      let tags = [];
      let selectedTagsCount = 0;
      if (item.tags && item.tags.length) {
        selectedTagsCount = this.countSelectedTags(item.tags);
        tags = item.tags.map((tag) => ({
          ...tag,
          editable: !!(tag.is_registered || selectedTagsCount < MAX_TAGS_COUNT),
        }));
      }
      this.setState({
        tags,
        isPrivate: item.restrict === 'private',
        selectedTagsCount,
      });
    }
  }

  handleOnChangeIsPrivate = (value) => {
    this.setState({
      isPrivate: value,
    });
  };

  handleOnCheckTag = (checkedTag) => {
    const { i18n } = this.props;
    const { tags } = this.state;
    let selectedTagsCount = this.countSelectedTags(tags);
    if (!checkedTag.editable) {
      if (selectedTagsCount > MAX_TAGS_COUNT - 1) {
        this.toast.show(i18n.formatString(i18n.tagsMaxLimit, MAX_TAGS_COUNT));
      }
      return;
    }
    const selectedTag = tags.find((tag) => tag.name === checkedTag.name);
    if (selectedTag) {
      if (selectedTag.is_registered) {
        selectedTagsCount -= 1;
      } else {
        selectedTagsCount += 1;
      }
    }
    const updatedTags = tags.map((tag) => {
      const isRegistered =
        tag.name === checkedTag.name ? !tag.is_registered : tag.is_registered;
      return {
        ...tag,
        is_registered: isRegistered,
        editable: !!(selectedTagsCount < MAX_TAGS_COUNT || isRegistered),
      };
    });
    this.setState({
      tags: updatedTags,
      selectedTagsCount,
    });
  };

  countSelectedTags = (tags) =>
    tags.reduce((count, tag) => (tag.is_registered ? ++count : count), 0);

  handleOnPressBookmarkButton = () => {
    const { id, onPressBookmark } = this.props;
    const { tags, isPrivate } = this.state;
    const selectedTags = tags
      .filter((tag) => tag.is_registered)
      .map((tag) => tag.name);
    const bookmarkType = isPrivate
      ? BOOKMARK_TYPES.PRIVATE
      : BOOKMARK_TYPES.PUBLIC;
    onPressBookmark(id, bookmarkType, selectedTags);
  };

  handleOnPressRemoveButton = () => {
    const { id, onPressRemoveBookmark } = this.props;
    onPressRemoveBookmark(id);
  };

  handleOnPressAddTag = () => {
    const { i18n } = this.props;
    const { newTag, tags } = this.state;
    if (!newTag) {
      return;
    }
    const isExistingTag = tags.some((tag) => tag.name === newTag);
    const newTagEntry = {
      name: newTag,
      is_registered: true,
      editable: true,
    };
    let updatedTags;
    if (isExistingTag) {
      const excludeExistingTagTags = tags.filter((tag) => tag.name !== newTag);
      updatedTags = [newTagEntry, ...excludeExistingTagTags];
    } else {
      updatedTags = [newTagEntry, ...tags];
      if (this.countSelectedTags(updatedTags) > MAX_TAGS_COUNT) {
        this.toast.show(i18n.formatString(i18n.tagsMaxLimit, MAX_TAGS_COUNT));
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

  renderItem = ({ item }) => (
    <TouchableRipple onPress={() => this.handleOnCheckTag(item)}>
      <View style={styles.row}>
        <Text style={styles.tagText}>{item.name}</Text>
        <Checkbox.Android
          status={item.is_registered ? 'checked' : 'unchecked'}
          onPress={() => this.handleOnCheckTag(item)}
          disabled={!item.editable}
        />
      </View>
    </TouchableRipple>
  );

  render() {
    const { isBookmark, i18n, onModalClose, theme } = this.props;
    const { tags, selectedTagsCount, isPrivate } = this.state;
    return (
      <Modal
        animationType="fade"
        transparent
        visible
        onRequestClose={onModalClose}
      >
        <TouchableWithoutFeedback onPress={onModalClose}>
          <View style={styles.container}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={{ backgroundColor: theme.colors.background }}>
                <View
                  style={[
                    styles.titleContainer,
                    { backgroundColor: theme.colors.modalTitleBackground },
                  ]}
                >
                  <Text style={styles.title}>
                    {isBookmark ? i18n.likeEdit : i18n.likeAdd}
                  </Text>
                </View>
                <View style={styles.subTitleContainer}>
                  <Text>{i18n.collectionTags}</Text>
                  <Text>{selectedTagsCount} / 10</Text>
                </View>
                <View style={styles.newTagContainer}>
                  <TextInput
                    ref={(ref) => (this.tagInput = ref)}
                    style={[
                      styles.tagInput,
                      { backgroundColor: theme.colors.background },
                    ]}
                    placeholder={i18n.collectionTagsAdd}
                    autoCorrect={false}
                    onChangeText={(text) => this.setState({ newTag: text })}
                  />
                  <PXTouchable
                    onPress={this.handleOnPressAddTag}
                    hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
                  >
                    <Icon name="plus" size={20} color={theme.colors.text} />
                  </PXTouchable>
                </View>
                <View style={styles.tagsContainer}>
                  <FlatList
                    data={tags}
                    keyExtractor={(item) => item.name}
                    renderItem={this.renderItem}
                    keyboardShouldPersistTaps="always"
                  />
                </View>
                <Separator />
                <View style={styles.row}>
                  <Text>{i18n.private}</Text>
                  <Switch
                    value={isPrivate}
                    onValueChange={this.handleOnChangeIsPrivate}
                  />
                </View>
                <Separator />
                <View
                  style={[
                    styles.actionContainer,
                    !isBookmark && { justifyContent: 'center' },
                  ]}
                >
                  {isBookmark && (
                    <PXTouchable
                      hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
                      onPress={this.handleOnPressRemoveButton}
                    >
                      <Text>{i18n.likeRemove}</Text>
                    </PXTouchable>
                  )}
                  <PXTouchable
                    style={
                      !isBookmark && {
                        flexDirection: 'row',
                        alignItems: 'center',
                      }
                    }
                    hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
                    onPress={this.handleOnPressBookmarkButton}
                  >
                    {!isBookmark && (
                      <MaterialIcon
                        name="favorite"
                        color="rgb(210, 212, 216)"
                        size={20}
                      />
                    )}

                    <Text>{isBookmark ? i18n.save : i18n.likeAdd}</Text>
                  </PXTouchable>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
        <Toast ref={(ref) => (this.toast = ref)} />
      </Modal>
    );
  }
}

export default withTheme(connectLocalization(BookmarkModal));
