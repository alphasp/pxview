import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, InteractionManager } from 'react-native';
import { connect } from 'react-redux';
import { withTheme } from 'react-native-paper';
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
    // backgroundColor: globalStyleVariables.BACKGROUND_COLOR,
    height: 200,
  },
});

class NovelDetailContent extends Component {
  constructor(props) {
    super(props);
    const { itemIndex, currentIndex } = props;
    this.state = {
      isVisible: currentIndex === undefined || itemIndex === currentIndex, // currentIndex will be undefined if open from deep link
      isOpenTagBottomSheet: false,
      selectedTag: null,
      isMounted: false,
    };
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        isMounted: true,
      });
    });
  }

  componentDidUpdate(prevProps) {
    const { itemIndex, currentIndex } = this.props;
    const { currentIndex: prevCurrentIndex } = prevProps;
    const { isVisible } = this.state;
    if (
      !isVisible &&
      currentIndex !== prevCurrentIndex &&
      currentIndex - 1 <= itemIndex <= currentIndex + 1
    ) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        isVisible: true,
      });
    }
  }

  handleOnPressNovelImage = () => {
    const {
      item,
      navigation: { navigate },
    } = this.props;
    navigate(SCREENS.NovelReader, {
      novelId: item.id,
    });
  };

  handleOnPressAvatar = (userId) => {
    const {
      navigation: { push },
    } = this.props;
    push(SCREENS.UserDetail, { userId });
  };

  handleOnPressTag = (tag) => {
    const {
      addSearchHistory,
      navigation: { push },
    } = this.props;
    addSearchHistory(tag);
    push(SCREENS.SearchResult, {
      word: tag,
      searchType: SEARCH_TYPES.NOVEL,
    });
  };

  handleOnLongPressTag = (tag) => {
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
      route,
      authUser,
      highlightTags,
      muteTags,
      tags,
      isMuteUser,
      onLongPressImage,
      theme,
    } = this.props;
    const {
      isOpenTagBottomSheet,
      selectedTag,
      isVisible,
      isMounted,
    } = this.state;
    if (!isMounted) {
      return null;
    }
    const isMute = tags.some((t) => t.isMute) || isMuteUser;
    return (
      <View style={styles.container}>
        <ScrollView>
          {isMute ? (
            <View
              style={[
                styles.mutedImageContainer,
                { backgroundColor: theme.colors.surface },
              ]}
            >
              <OverlayMutedIndicator />
            </View>
          ) : (
            <View>
              <PXCacheImageTouchable
                key={item.image_urls.medium}
                uri={item.image_urls.medium}
                initWidth={globalStyleVariables.WINDOW_HEIGHT}
                initHeight={200}
                imageStyle={styles.image}
                onPress={this.handleOnPressNovelImage}
                onLongPress={onLongPressImage}
              />
              {item.page_count > 1 ? (
                <OverlayNovelPages total={item.page_count} />
              ) : null}
            </View>
          )}
          <DetailFooter
            item={item}
            tags={tags}
            navigation={navigation}
            route={route}
            authUser={authUser}
            onPressAvatar={this.handleOnPressAvatar}
            onPressTag={this.handleOnPressTag}
            onLongPressTag={this.handleOnLongPressTag}
            isDetailPageReady={isVisible}
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

export default withTheme(
  connect(() => {
    const getTagsWithStatus = makeGetTagsWithStatus();
    return (state, props) => ({
      highlightTags: state.highlightTags.items,
      muteTags: state.muteTags.items,
      isMuteUser: state.muteUsers.items.some(
        (m) => m.id === props.item.user.id,
      ),
      tags: getTagsWithStatus(state, props),
    });
  }, searchHistoryActionCreators)(NovelDetailContent),
);
