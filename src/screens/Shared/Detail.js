import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
  FlatList,
  InteractionManager,
  Platform,
  Linking,
  LayoutAnimation,
  UIManager,
} from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment';
import HtmlView from 'react-native-htmlview';
import Icon from 'react-native-vector-icons/FontAwesome';
import Share from 'react-native-share';
import ActionButton from 'react-native-action-button';
import RelatedIllusts from './RelatedIllusts';
import IllustComments from './IllustComments';
import { connectLocalization } from '../../components/Localization';
import BookmarkButton from '../../components/BookmarkButton';
import Loader from '../../components/Loader';
import PXTouchable from '../../components/PXTouchable';
import FollowButtonContainer from '../../containers/FollowButtonContainer';
import PXCacheImageTouchable from '../../components/PXCacheImageTouchable';
import PXThumbnail from '../../components/PXThumbnail';
import Tags from '../../components/Tags';
import HeaderSaveImageButton from '../../components/HeaderSaveImageButton';
import HeaderShareButton from '../../components/HeaderShareButton';
// import { connectLocalization } from '../../components/Localization';
import * as browsingHistoryActionCreators
  from '../../common/actions/browsingHistory';
import { makeGetDetailItem } from '../../common/selectors';

const windowWidth = Dimensions.get('window').width; // full width
const THUMBNAIL_SIZE = 30;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    // backgroundColor: '#F5FCFF',
  },
  infoContainer: {
    margin: 10,
  },
  sectionHeader: {
    margin: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontWeight: 'bold',
  },
  headerThumnailNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    borderRadius: THUMBNAIL_SIZE / 2,
  },
  thumnailNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nameContainer: {
    flexDirection: 'column',
    marginLeft: 10,
  },
  headerText: {
    color: '#fff',
  },
  captionContainer: {
    marginVertical: 10,
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
});

class Detail extends Component {
  static navigationOptions = ({ navigation }) => {
    const { state, navigate } = navigation;
    const { item, images } = state.params;
    const shareOptions = {
      message: `${item.title} | ${item.user.name} #pxview`,
      url: `http://www.pixiv.net/member_illust.php?illust_id=${item.id}&mode=medium`,
    };
    return {
      headerTitle: (
        <PXTouchable
          style={styles.headerThumnailNameContainer}
          onPress={() => navigate('UserDetail', { userId: item.user.id })}
        >
          <PXThumbnail
            uri={item.user.profile_image_urls.medium}
            size={THUMBNAIL_SIZE}
          />
          <View style={styles.nameContainer}>
            <Text style={styles.headerText}>{item.user.name}</Text>
            <Text style={styles.headerText}>{item.user.account}</Text>
          </View>
        </PXTouchable>
      ),
      headerRight: images &&
        images.length &&
        <View style={{ flexDirection: 'row' }}>
          <HeaderSaveImageButton imageUrls={images} saveAll />
          <HeaderShareButton onPress={() => Share.open(shareOptions).catch()} />
        </View>,
    };
  };

  constructor(props) {
    // const { item } = props;
    super(props);
    const { item } = props;
    const images = item.page_count > 1
      ? item.meta_pages.map(page => page.image_urls.original)
      : [item.meta_single_page.original_image_url];
    this.state = {
      mounting: true,
      isInitState: true,
      isActionButtonVisible: true,
      relatedIllustsViewPosition: null,
      footerViewHeight: null,
      images,
    };
    this.listViewOffset = 0;
    if (Platform.OS === 'android') {
      /* eslint no-unused-expressions: ["error", { "allowShortCircuit": true }] */
      UIManager.setLayoutAnimationEnabledExperimental &&
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  componentDidMount() {
    const { item, navigation, addBrowsingHistory } = this.props;
    const { images } = this.state;
    navigation.setParams({
      item,
      images,
    });
    InteractionManager.runAfterInteractions(() => {
      if (this.detailView) {
        this.setState({ mounting: false });
      }
      addBrowsingHistory(item.id);
    });
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  renderItem = ({ item, index }) => (
    <PXCacheImageTouchable
      key={item.image_urls.large}
      uri={item.image_urls.large}
      initWidth={windowWidth}
      initHeight={200}
      style={{
        backgroundColor: '#E9EBEE',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: 'gray',
      }}
      imageStyle={{
        resizeMode: 'contain',
      }}
      pageNumber={index + 1}
      onPress={() => this.handleOnPressImage(index)}
    />
  );

  renderFooter = () => {
    const { item, navigation, i18n } = this.props;
    return (
      <View onLayout={this.handleOnLayoutFooter}>
        <View style={styles.infoContainer}>
          <View style={styles.profileContainer}>
            <PXTouchable
              style={styles.thumnailNameContainer}
              onPress={() => this.handleOnPressAvatar(item.user.id)}
            >
              <PXThumbnail uri={item.user.profile_image_urls.medium} />
              <View style={styles.nameContainer}>
                <Text>{item.user.name}</Text>
                <Text>{item.user.account}</Text>
              </View>
            </PXTouchable>
            <FollowButtonContainer user={item.user} navigation={navigation} />
          </View>
          <View style={styles.captionContainer}>
            <HtmlView
              value={item.caption}
              onLinkPress={this.handleOnLinkPress}
            />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text>{moment(item.create_date).format('YYYY-MM-DD')}</Text>
            <Icon name="eye" style={{ marginLeft: 10 }} />
            <Text style={{ marginLeft: 5 }}>{item.total_view}</Text>
            <Icon name="heart" style={{ marginLeft: 10 }} />
            <Text style={{ marginLeft: 5 }}>{item.total_bookmarks}</Text>
          </View>
          {<Tags tags={item.tags} onPressTag={this.handleOnPressTag} />}
        </View>
        <View>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{i18n.comments}</Text>
          </View>
          <IllustComments
            illustId={item.id}
            isFeatureInDetailPage
            maxItems={6}
            navigation={navigation}
          />
        </View>
        <View onLayout={this.handleOnLayoutRelatedIllusts}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{i18n.relatedWorks}</Text>
          </View>
          <RelatedIllusts
            illustId={item.id}
            isFeatureInDetailPage
            maxItems={6}
            navigation={navigation}
          />
        </View>
      </View>
    );
  };

  handleOnPressTag = tag => {
    const { navigate } = this.props.navigation;
    navigate('SearchResult', { word: tag });
    // Actions.searchResult({ word: tag });
  };

  handleOnPressAvatar = userId => {
    const { navigate } = this.props.navigation;
    navigate('UserDetail', { userId });
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
        imagePageNumber: `${viewableItems[0].index + 1} / ${item.meta_pages.length}`,
      });
      if (viewableItems.length === 2) {
        // console.log('visible row ', visibleRowNumbers[0])
        // Actions.refresh({ title: `${visibleRowNumbers[0] + 1} of ${item.meta_pages.length}`});
        // visible row is visibleRowNumbers[0]
      }
      if (viewableItems.length === 3) {
        // visible row is visibleRowNumbers[1]
      }
    } else {
      const { imagePageNumber } = this.state;
      if (imagePageNumber) {
        this.setState({
          imagePageNumber: null,
        });
      }
    }
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
    const { item } = this.props;
    if (item.page_count > 1) {
      this.handleOnScrollMultiImagesList();
    }
    // const { isActionButtonVisible, relatedIllustsViewPosition } = this.state;
    // Simple fade-in / fade-out animation
    const CustomLayoutLinear = {
      duration: 100,
      create: {
        type: LayoutAnimation.Types.linear,
        property: LayoutAnimation.Properties.opacity,
      },
      update: {
        type: LayoutAnimation.Types.linear,
        property: LayoutAnimation.Properties.opacity,
      },
      delete: {
        type: LayoutAnimation.Types.linear,
        property: LayoutAnimation.Properties.opacity,
      },
    };
    // Check if the user is scrolling up or down by confronting the new scroll position with your own one
    const currentOffset = e.nativeEvent.contentOffset.y;
    const contentHeight = e.nativeEvent.contentSize.height;
    const direction = currentOffset > 0 && currentOffset > this.listViewOffset
      ? 'down'
      : 'up';
    const layoutHeight = e.nativeEvent.layoutMeasurement.height;
    const offsetToHide =
      contentHeight -
      this.state.footerViewHeight +
      (this.state.relatedIllustsViewPosition - layoutHeight);
    // If the user is scrolling down (and the action-button is still visible) hide it
    const isActionButtonVisible =
      direction === 'up' &&
      (currentOffset < offsetToHide || currentOffset === 0);
    if (isActionButtonVisible !== this.state.isActionButtonVisible) {
      LayoutAnimation.configureNext(CustomLayoutLinear);
      this.setState({ isActionButtonVisible });
    }
    this.listViewOffset = currentOffset;
  };

  handleOnLinkPress = url => {
    console.log('clicked link: ', url);
    Linking.canOpenURL(url)
      .then(supported => {
        if (!supported) {
          console.log(`Can't handle url: ${url}`);
          return null;
        }
        return Linking.openURL(url);
      })
      .catch(err => {
        console.error('Error on link press ', err);
      });
  };

  handleOnPressImage = index => {
    const { navigate } = this.props.navigation;
    const { images } = this.state;
    navigate('ImagesViewer', {
      images,
      viewerIndex: index,
    });
  };

  handleOnLayoutRelatedIllusts = e => {
    this.setState({
      relatedIllustsViewPosition: e.nativeEvent.layout.y,
    });
  };

  handleOnLayoutFooter = e => {
    this.setState({
      footerViewHeight: e.nativeEvent.layout.height,
    });
  };

  renderContent = () => {
    const { item } = this.props;
    const { imagePageNumber, isScrolling, isInitState } = this.state;
    return (
      <View>
        {item.page_count > 1
          ? <View>
              <View style={{ flex: 1 }}>
                <FlatList
                  data={item.meta_pages}
                  keyExtractor={page => page.image_urls.large}
                  renderItem={this.renderItem}
                  debug={false}
                  disableVirtualization
                  removeClippedSubviews={false}
                  ListFooterComponent={this.renderFooter}
                  onScroll={this.handleOnScroll}
                  onViewableItemsChanged={this.handleOnViewableItemsChanged}
                />
              </View>
              {(isInitState || isScrolling) &&
                imagePageNumber &&
                <View style={styles.imagePageNumberContainer}>
                  <Text style={styles.imagePageNumber}>
                    {imagePageNumber}
                  </Text>
                </View>}
            </View>
          : <ScrollView onScroll={this.handleOnScroll} scrollEventThrottle={16}>
              <PXCacheImageTouchable
                uri={item.image_urls.large}
                initWidth={item.width > windowWidth ? windowWidth : item.width}
                initHeight={windowWidth * item.height / item.width}
                style={{
                  backgroundColor: '#E9EBEE',
                }}
                imageStyle={{
                  resizeMode: 'contain',
                }}
                onPress={() => this.handleOnPressImage(0)}
              />
              {this.renderFooter()}
            </ScrollView>}
      </View>
    );
  };

  render() {
    const { item } = this.props;
    const { mounting, isActionButtonVisible } = this.state;
    return (
      <View style={styles.container} ref={ref => (this.detailView = ref)}>
        {mounting ? <Loader /> : this.renderContent()}
        {isActionButtonVisible &&
          <ActionButton
            buttonColor="rgba(255,255,255,1)"
            icon={<BookmarkButton item={item} />}
          />}
      </View>
    );
  }
}

export default connectLocalization(
  connect(() => {
    const getDetailItem = makeGetDetailItem();
    return (state, props) => ({
      item: getDetailItem(state, props),
    });
  }, browsingHistoryActionCreators)(Detail),
);
