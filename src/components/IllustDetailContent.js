import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { withTheme } from 'react-native-paper';
import DetailFooter from './DetailFooter';
import PXCacheImageTouchable from './PXCacheImageTouchable';
import UgoiraViewTouchable from './UgoiraViewTouchable';
import TagBottomSheet from './TagBottomSheet';
import OverlayMutedIndicator from './OverlayMutedIndicator';
import * as searchHistoryActionCreators from '../common/actions/searchHistory';
import { makeGetTagsWithStatus } from '../common/selectors';
import { SEARCH_TYPES, SCREENS } from '../common/constants';
import { globalStyleVariables } from '../styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: globalStyleVariables.WINDOW_WIDTH,
  },
  imagePageNumberContainer: {
    top: 10,
    right: 10,
    position: 'absolute',
    justifyContent: 'center',
    backgroundColor: 'grey',
    borderRadius: 10,
    paddingHorizontal: 8,
    // height: 32,
  },
  imagePageNumber: {
    color: '#fff',
    padding: 2,
  },
  multiImageContainer: {
    backgroundColor: globalStyleVariables.BACKGROUND_COLOR,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'gray',
  },
  imageContainer: {
    backgroundColor: globalStyleVariables.BACKGROUND_COLOR,
  },
  image: {
    resizeMode: 'contain',
  },
  mutedImageContainer: {
    flex: 1,
    height: 200,
  },
});

class IllustDetailContent extends Component {
  constructor(props) {
    super(props);
    const { itemIndex, currentIndex } = props;
    this.state = {
      isVisible: currentIndex === undefined || itemIndex === currentIndex, // currentIndex will be undefined if open from deep link
      isInitState: true,
      isScrolling: false,
      imagePageNumber: null,
      isOpenTagBottomSheet: false,
      selectedTag: null,
    };
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

  shouldComponentUpdate(nextProps, nextState) {
    const {
      item: prevItem,
      tags: prevTags,
      isMuteUser: prevIsMuteUser,
      route: prevRoute,
      isVisible,
    } = this.props;
    const { item, tags, isMuteUser, route } = nextProps;
    const {
      isInitState: prevIsInitState,
      isScrolling: prevIsScrolling,
      imagePageNumber: prevImagePageNumber,
      isOpenTagBottomSheet: prevIsOpenTagBottomSheet,
      selectedTag: prevSelectedTag,
      isVisible: prevIsVisible,
    } = this.state;
    const {
      isInitState,
      isScrolling,
      imagePageNumber,
      isOpenTagBottomSheet,
      selectedTag,
    } = nextState;
    if (item.user.is_followed !== prevItem.user.is_followed) {
      return true;
    }
    if (
      isInitState !== prevIsInitState ||
      isScrolling !== prevIsScrolling ||
      imagePageNumber !== prevImagePageNumber ||
      isOpenTagBottomSheet !== prevIsOpenTagBottomSheet ||
      selectedTag !== prevSelectedTag ||
      tags !== prevTags ||
      isMuteUser !== prevIsMuteUser ||
      route !== prevRoute ||
      isVisible !== prevIsVisible
    ) {
      return true;
    }
    return false;
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  handleOnPressTag = (tag) => {
    const {
      addSearchHistory,
      navigation: { push },
    } = this.props;
    addSearchHistory(tag);
    push(SCREENS.SearchResult, {
      word: tag,
      searchType: SEARCH_TYPES.ILLUST,
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

  handleOnPressAvatar = (userId) => {
    const {
      navigation: { push },
    } = this.props;
    push(SCREENS.UserDetail, { userId });
  };

  handleOnScrollMultiImagesList = () => {
    const { isInitState, isScrolling } = this.state;
    if (isInitState) {
      this.setState({
        isInitState: false,
      });
    }
    if (!isScrolling) {
      this.setState({
        isScrolling: true,
      });
    }
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.setState({ isScrolling: false });
    }, 2000);
  };

  handleOnScroll = (e) => {
    const { item, onScroll } = this.props;
    if (item.page_count > 1) {
      this.handleOnScrollMultiImagesList();
    }
    const { imagePageNumber } = this.state;
    // Check if the user is scrolling up or down by confronting the new scroll position with your own one
    const currentOffset = e.nativeEvent.contentOffset.y;
    const contentHeight = e.nativeEvent.contentSize.height;
    const offsetToHideImagePageNumber = contentHeight - this.footerViewHeight;
    if (currentOffset > offsetToHideImagePageNumber && imagePageNumber) {
      this.setState({
        imagePageNumber: null,
      });
    }
    if (onScroll) {
      onScroll(e);
    }
  };

  handleOnViewableItemsChanged = ({ viewableItems }) => {
    const { item } = this.props;
    if (
      item.meta_pages &&
      item.meta_pages.length &&
      viewableItems &&
      viewableItems.length
    ) {
      this.setState({
        imagePageNumber: `${viewableItems[0].index + 1} / ${
          item.meta_pages.length
        }`,
      });
    }
  };

  handleOnLayoutFooter = (e) => {
    this.footerViewHeight = e.nativeEvent.layout.height;
  };

  renderItem = ({ item, index }) => {
    const { onPressImage, onLongPressImage, imageQuality } = this.props;
    return (
      <PXCacheImageTouchable
        key={item.image_urls[imageQuality]}
        uri={item.image_urls[imageQuality]}
        initWidth={globalStyleVariables.WINDOW_HEIGHT}
        initHeight={200}
        style={styles.multiImageContainer}
        imageStyle={styles.image}
        pageNumber={index + 1}
        index={index}
        onPress={onPressImage}
        onLongPress={onLongPressImage}
      />
    );
  };

  renderImageOrUgoira = (isMute) => {
    const {
      item,
      onPressImage,
      onLongPressImage,
      theme,
      imageQuality,
    } = this.props;
    if (isMute) {
      return (
        <View
          style={[
            styles.mutedImageContainer,
            { backgroundColor: theme.colors.surface },
          ]}
        >
          <OverlayMutedIndicator />
        </View>
      );
    }
    if (item.type === 'ugoira') {
      return <UgoiraViewTouchable item={item} />;
    }
    return (
      <PXCacheImageTouchable
        uri={item.image_urls[imageQuality]}
        initWidth={
          item.width > globalStyleVariables.WINDOW_WIDTH
            ? globalStyleVariables.WINDOW_WIDTH
            : item.width
        }
        initHeight={
          (globalStyleVariables.WINDOW_WIDTH * item.height) / item.width
        }
        style={styles.imageContainer}
        imageStyle={styles.image}
        onPress={onPressImage}
        onLongPress={onLongPressImage}
        index={0}
      />
    );
  };

  renderFooter = () => {
    const { item, navigation, authUser, tags, route } = this.props;
    return (
      <DetailFooter
        onLayoutView={this.handleOnLayoutFooter}
        item={item}
        tags={tags}
        navigation={navigation}
        route={route}
        authUser={authUser}
        onPressAvatar={this.handleOnPressAvatar}
        onPressTag={this.handleOnPressTag}
        onLongPressTag={this.handleOnLongPressTag}
      />
    );
  };

  render() {
    const {
      item,
      onScroll,
      navigation,
      tags,
      highlightTags,
      muteTags,
      isMuteUser,
    } = this.props;
    const {
      imagePageNumber,
      isScrolling,
      isInitState,
      isOpenTagBottomSheet,
      selectedTag,
      isVisible,
    } = this.state;
    // if (!isVisible) {
    //   return null;
    // }
    const isMute = tags.some((t) => t.isMute) || isMuteUser;
    return (
      <View key={item.id} style={styles.container}>
        {!isMute && item.page_count > 1 ? (
          <View>
            <FlatList
              data={item.meta_pages}
              keyExtractor={(page) => page.image_urls.large}
              renderItem={this.renderItem}
              removeClippedSubviews={false}
              ListFooterComponent={this.renderFooter}
              onScroll={this.handleOnScroll}
              onViewableItemsChanged={this.handleOnViewableItemsChanged}
              scrollEventThrottle={16}
              bounces={false}
            />
            {(isInitState || isScrolling) && imagePageNumber && (
              <View style={styles.imagePageNumberContainer}>
                <Text style={styles.imagePageNumber}>{imagePageNumber}</Text>
              </View>
            )}
          </View>
        ) : (
          <ScrollView
            onScroll={onScroll}
            scrollEventThrottle={16}
            bounces={false}
          >
            {this.renderImageOrUgoira(isMute)}
            {this.renderFooter()}
          </ScrollView>
        )}
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
      imageQuality: state.displaySettings.detailScreenImageQuality,
    });
  }, searchHistoryActionCreators)(IllustDetailContent),
);
