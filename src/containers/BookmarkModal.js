import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  Text,
  TextInput,
  ListView,
  TouchableWithoutFeedback,
  Modal,
  Switch,
  Keyboard,
} from 'react-native';
import { connect } from 'react-redux';
import { MKCheckbox } from 'react-native-material-kit';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Toast, { DURATION } from 'react-native-easy-toast'
import PXTouchable from '../components/PXTouchable';
import * as illustBookmarkDetailActionCreators from '../common/actions/illustBookmarkDetail';
import * as bookmarkIllustActionCreators from '../common/actions/bookmarkIllust';
import { BookmarkType } from '../common/actions/bookmarkIllust';

const MAX_TAGS_COUNT = 10;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 80,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  innerContainer: {
    // borderRadius: 10,
    //alignItems: 'center',
    backgroundColor: '#fff', 
    //padding: 20
  },
  titleContainer: {
    backgroundColor: '#E9EBEE',
    padding: 10
  },
  title: {
    fontWeight: "bold", 
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
    marginRight: 10
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
  }
});

class BookmarkModal extends Component {
  constructor(props) {
    super(props);
    const { isBookmark } = props;
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2,
        sectionHeaderHasChanged: (s1,s2) => s1 !== s2
      }),
      tags: [],
      isPrivate: false,
      selectedTagsCount: 0,
      newTag: null,
    };
  }

  componentDidMount() {
    const { illustId, fetchIllustBookmarkDetail, clearIllustBookmarkDetail, tagType } = this.props;
    clearIllustBookmarkDetail(illustId);
    fetchIllustBookmarkDetail(illustId);
  }

  componentWillReceiveProps(nextProps) {
    const { illustBookmarkDetail: { item: prevItem } } = this.props;
    const { illustBookmarkDetail: { item } } = nextProps;
    if (item && item !== prevItem) {
      const { dataSource } = this.state;
      const selectedTagsCount = this.countSelectedTags(item.tags);
      const tags = item.tags.map(tag => {
        return {
          ...tag,
          editable: (tag.is_registered || selectedTagsCount < MAX_TAGS_COUNT) ? true : false
        }
      });
      this.setState({
        dataSource: dataSource.cloneWithRows(tags),
        tags,
        isPrivate: item.restrict === 'private' ? true : false,
        selectedTagsCount
      });
    }
  }

  handleOnChangeIsPrivate = (value) => {
    this.setState({
      isPrivate: value
    });
  }

  handleOnCheckTag = (checkedTag) => {
    const { dataSource, tags } = this.state;
    let selectedTagsCount = this.countSelectedTags(tags);
    if (!checkedTag.editable) {
      if (selectedTagsCount > MAX_TAGS_COUNT - 1) {
        this.toast.show(`Maximum of tags is ${MAX_TAGS_COUNT}`, DURATION.LENGTH_LONG);
      }
      return;
    }
    const selectedTag = tags.find(tag => tag.name === checkedTag.name);
    if (selectedTag) {
      if (selectedTag.is_registered) {
        selectedTagsCount--;
      }
      else {
        selectedTagsCount++;
      }
    }
    console.log('selectedTagsCount ', selectedTagsCount)
    const updatedTags = tags.map(tag => {
      const isRegistered = tag.name === checkedTag.name ? !tag.is_registered : tag.is_registered;
      return {
        ...tag,
        is_registered: isRegistered,
        editable: (selectedTagsCount < MAX_TAGS_COUNT || isRegistered) ? true : false,
      }
    });
    //selectedTagsCount < 3 || item.is_registered) ? true : 
    // const selectedTagsCount = this.countSelectedTags(updatedTags);
    this.setState({
      tags: updatedTags,
      dataSource: dataSource.cloneWithRows(updatedTags),
      selectedTagsCount,
    });
  }

  countSelectedTags = (tags) => {
    return tags.reduce((count, tag) => {
      return tag.is_registered ? ++count : count;
    }, 0);
  }

  handleOnPressLike = () => {
    const { illustId, isBookmark, bookmarkIllust, onPressCloseButton } = this.props;
    const { tags, isPrivate } = this.state;
    const selectedTags = tags.filter(tag => tag.is_registered).map(tag => tag.name);
    const bookmarkType = isPrivate ? BookmarkType.PRIVATE : BookmarkType.PUBLIC;
    bookmarkIllust(illustId, bookmarkType, selectedTags);
    onPressCloseButton();
  }

  handleOnPressRemove = () => {
    const { illustId, unbookmarkIllust, onPressCloseButton } = this.props;
    unbookmarkIllust(illustId);
    onPressCloseButton();
  }

  handleOnPressAddTag = () => {
    const { newTag, tags, dataSource } = this.state;
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
    }
    else {
      updatedTags = [newTagEntry, ...tags];
      if (this.countSelectedTags(updatedTags) > MAX_TAGS_COUNT) {
        this.toast.show(`Maximum of tags is ${MAX_TAGS_COUNT}`, DURATION.LENGTH_LONG);
        this.setState({
          newTag: null
        });
        return;
      }
    }

    this.setState({
      dataSource: dataSource.cloneWithRows(updatedTags),
      tags: updatedTags,
      selectedTagsCount: this.countSelectedTags(updatedTags),
      newTag: null
    })
    this.tagInput.setNativeProps({ text: '' });
  }

  renderRow = (item) => {
    const { tag, onSelectTag } = this.props;
    const { selectedTagsCount } = this.state;
    return (
      <PXTouchable 
        key={item.name} 
        onPress={() => this.handleOnCheckTag(item)}
      >
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
  }

  render() {
    const { illustBookmarkDetail: { item, loading, loaded }, isBookmark, onSelectTag, isOpen, onPressCloseButton } = this.props;
    const { dataSource, tags, selectedTagsCount, isPrivate } = this.state;
    return (
      <View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={isOpen}
          onRequestClose={onPressCloseButton}
        >
          <PXTouchable style={styles.container} onPress={onPressCloseButton}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={styles.innerContainer}>
                <View style={styles.titleContainer}>
                  <Text style={styles.title}>
                    {isBookmark ? "Edit Like" : "Add Like"}
                  </Text>
                </View>
                <View style={styles.subTitleContainer}>
                  <Text>Collection Tags</Text>
                  <Text>{selectedTagsCount} / 10</Text>
                </View>
                <View style={styles.newTagContainer}>
                  <TextInput
                    ref={(ref) => this.tagInput = ref}
                    style={styles.tagInput}
                    placeholder="Add tag"
                    autoCorrect={false}
                    onChangeText={(text) => this.setState({newTag: text})}
                  />
                  <PXTouchable onPress={this.handleOnPressAddTag}>
                    <Icon name="plus" size={20}/>
                  </PXTouchable>
                </View>
                <ListView
                  dataSource={dataSource}
                  renderRow={this.renderRow}
                  keyboardShouldPersistTaps="always"
                />  
                <View style={styles.row}>
                  <Text>Private</Text>
                  <Switch value={isPrivate} onValueChange={this.handleOnChangeIsPrivate} />
                </View>
                <View style={[styles.actionContainer, !isBookmark && {justifyContent: "center"}]}>
                  {
                    isBookmark &&
                    <PXTouchable onPress={this.handleOnPressRemove}>
                      <Text>Remove Like</Text>
                    </PXTouchable>
                  }
                  <PXTouchable 
                    style={!isBookmark && {flexDirection: "row", alignItems: "center"}}
                    onPress={this.handleOnPressLike}
                  >
                    {
                      !isBookmark &&
                      <MaterialIcon
                        name="favorite"
                        color="rgb(210, 212, 216)"
                        size={20} 
                      />
                    }
                    <Text>{isBookmark ? "Save" : "Like"}</Text>
                  </PXTouchable>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </PXTouchable>
          <Toast ref={ref => this.toast = ref} />
        </Modal>
      </View>
    );
  }
}

export default connect((state, props) => {
  return {
    illustBookmarkDetail: state.illustBookmarkDetail
  }
}, { ...illustBookmarkDetailActionCreators, ...bookmarkIllustActionCreators })(BookmarkModal);
