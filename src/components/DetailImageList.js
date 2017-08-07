import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  Linking,
} from 'react-native';
import { connect } from 'react-redux';
import DetailFooter from './DetailFooter';
import PXCacheImageTouchable from './PXCacheImageTouchable';
import * as searchHistoryActionCreators from '../common/actions/searchHistory';
import { SEARCH_TYPES, SCREENS } from '../common/constants';
import { globalStyleVariables } from '../styles';

const styles = StyleSheet.create({
  container: {
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
});

class DetailImageList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isInitState: true,
      isScrolling: false,
      imagePageNumber: null,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { item: prevItem } = this.props;
    const { item } = nextProps;
    const {
      isInitState: prevIsInitState,
      isScrolling: prevIsScrolling,
      imagePageNumber: prevImagePageNumber,
    } = this.state;
    const { isInitState, isScrolling, imagePageNumber } = nextState;
    if (item.user.is_followed !== prevItem.user.is_followed) {
      return true;
    }
    if (
      isInitState !== prevIsInitState ||
      isScrolling !== prevIsScrolling ||
      imagePageNumber !== prevImagePageNumber
    ) {
      return true;
    }
    return false;
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  handleOnPressImage = index => {
    const { onPressImage } = this.props;
    onPressImage(index);
  };

  handleOnPressTag = tag => {
    const { addSearchHistory, navigation: { navigate } } = this.props;
    addSearchHistory(tag);
    navigate(SCREENS.SearchResult, {
      word: tag,
      searchType: SEARCH_TYPES.ILLUST,
    });
  };

  handleOnPressAvatar = userId => {
    const { navigate } = this.props.navigation;
    navigate(SCREENS.UserDetail, { userId });
  };

  handleOnPressLink = url => {
    Linking.canOpenURL(url)
      .then(supported => {
        if (!supported) {
          return null;
        }
        return Linking.openURL(url);
      })
      .catch(err => err);
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

  handleOnScroll = e => {
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
        imagePageNumber: `${viewableItems[0].index + 1} / ${item.meta_pages
          .length}`,
      });
    }
  };

  handleOnLayoutFooter = e => {
    this.footerViewHeight = e.nativeEvent.layout.height;
  };

  renderItem = ({ item, index }) =>
    <PXCacheImageTouchable
      key={item.image_urls.medium}
      uri={item.image_urls.medium}
      initWidth={globalStyleVariables.WINDOW_HEIGHT}
      initHeight={200}
      style={styles.multiImageContainer}
      imageStyle={styles.image}
      pageNumber={index + 1}
      onPress={() => this.handleOnPressImage(index)}
    />;

  renderFooter = () => {
    const { item, navigation, i18n, authUser } = this.props;
    return (
      <DetailFooter
        onLayoutView={this.handleOnLayoutFooter}
        item={item}
        navigation={navigation}
        i18n={i18n}
        authUser={authUser}
        onPressAvatar={this.handleOnPressAvatar}
        onPressTag={this.handleOnPressTag}
        onPressLink={this.handleOnPressLink}
      />
    );
  };

  render() {
    const { item, onScroll } = this.props;
    const { imagePageNumber, isScrolling, isInitState } = this.state;
    return (
      <View key={item.id} style={styles.container}>
        {item.page_count > 1
          ? <View>
              <FlatList
                data={item.meta_pages}
                keyExtractor={page => page.image_urls.large}
                renderItem={this.renderItem}
                removeClippedSubviews={false}
                ListFooterComponent={this.renderFooter}
                onScroll={this.handleOnScroll}
                onViewableItemsChanged={this.handleOnViewableItemsChanged}
                scrollEventThrottle={16}
                bounces={false}
              />
              {(isInitState || isScrolling) &&
                imagePageNumber &&
                <View style={styles.imagePageNumberContainer}>
                  <Text style={styles.imagePageNumber}>
                    {imagePageNumber}
                  </Text>
                </View>}
            </View>
          : <ScrollView
              onScroll={onScroll}
              scrollEventThrottle={16}
              bounces={false}
            >
              <PXCacheImageTouchable
                uri={item.image_urls.medium}
                initWidth={
                  item.width > globalStyleVariables.WINDOW_WIDTH
                    ? globalStyleVariables.WINDOW_WIDTH
                    : item.width
                }
                initHeight={
                  globalStyleVariables.WINDOW_WIDTH * item.height / item.width
                }
                style={styles.imageContainer}
                imageStyle={styles.image}
                onPress={() => this.handleOnPressImage(0)}
              />
              {this.renderFooter()}
            </ScrollView>}
      </View>
    );
  }
}

export default connect(null, searchHistoryActionCreators)(DetailImageList);
