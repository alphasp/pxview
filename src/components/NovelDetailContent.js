import React, { Component } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import TagBottomSheet from './TagBottomSheet';
import PXCacheImageTouchable from './PXCacheImageTouchable';
import OverlayNovelPages from './OverlayNovelPages';
import OverlayMutedIndicator from './OverlayMutedIndicator';
import DetailFooter from './DetailFooter';
import * as searchHistoryActionCreators from '../common/actions/searchHistory';
import { makeGetTagsWithStatus } from '../common/selectors';
import { SCREENS, SEARCH_TYPES } from '../common/constants';
import { globalStyleVariables } from '../styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // width: globalStyleVariables.WINDOW_WIDTH,
  },
  image: {
    resizeMode: 'contain',
  },
  mutedImageContainer: {
    flex: 1,
    backgroundColor: globalStyleVariables.BACKGROUND_COLOR,
    height: 200,
  },
});

class NovelDetailContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpenTagBottomSheet: false,
      selectedTag: null,
    };
  }

  handleOnPressAvatar = userId => {
    const { navigate } = this.props.navigation;
    navigate(SCREENS.UserDetail, { userId });
  };

  handleOnPressNovelImage = () => {
    const { item, navigation: { navigate } } = this.props;
    navigate(SCREENS.NovelReader, {
      novelId: item.id,
    });
  };

  handleOnPressAvatar = userId => {
    const { navigate } = this.props.navigation;
    navigate(SCREENS.UserDetail, { userId });
  };

  handleOnPressTag = tag => {
    const { addSearchHistory, navigation: { navigate } } = this.props;
    addSearchHistory(tag);
    navigate(SCREENS.SearchResult, {
      word: tag,
      searchType: SEARCH_TYPES.NOVEL,
    });
  };

  handleOnLongPressTag = tag => {
    this.setState({
      isOpenTagBottomSheet: true,
      selectedTag: tag,
    });
  };

  handleOnCancelTagBottomSheet = () => {
    this.setState({
      isOpenTagBottomSheet: false,
    });
  };

  render() {
    const {
      item,
      navigation,
      authUser,
      highlightTags,
      muteTags,
      tags,
      isMuteUser,
    } = this.props;
    const { isOpenTagBottomSheet, selectedTag } = this.state;
    const isMute = tags.some(t => t.isMute) || isMuteUser;
    return (
      <View style={styles.container}>
        <ScrollView>
          {isMute
            ? <View style={styles.mutedImageContainer}>
                <OverlayMutedIndicator />
              </View>
            : <View>
                <PXCacheImageTouchable
                  key={item.image_urls.medium}
                  uri={item.image_urls.medium}
                  initWidth={globalStyleVariables.WINDOW_HEIGHT}
                  initHeight={200}
                  imageStyle={styles.image}
                  onPress={this.handleOnPressNovelImage}
                />
                {item.page_count > 1
                  ? <OverlayNovelPages total={item.page_count} />
                  : null}
              </View>}
          <DetailFooter
            item={item}
            tags={tags}
            navigation={navigation}
            authUser={authUser}
            onPressAvatar={this.handleOnPressAvatar}
            onPressTag={this.handleOnPressTag}
            onLongPressTag={this.handleOnLongPressTag}
          />
        </ScrollView>
        <TagBottomSheet
          visible={isOpenTagBottomSheet}
          selectedTag={selectedTag}
          isHighlight={highlightTags.includes(selectedTag)}
          isMute={muteTags.includes(selectedTag)}
          navigation={navigation}
          onCancel={this.handleOnCancelTagBottomSheet}
        />
      </View>
    );
  }
}

export default connect(() => {
  const getTagsWithStatus = makeGetTagsWithStatus();
  return (state, props) => ({
    highlightTags: state.highlightTags.items,
    muteTags: state.muteTags.items,
    isMuteUser: state.muteUsers.items.some(m => m === props.item.user.id),
    tags: getTagsWithStatus(state, props),
  });
}, searchHistoryActionCreators)(NovelDetailContent);
