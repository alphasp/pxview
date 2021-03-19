import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  InteractionManager,
  Platform,
  LayoutAnimation,
  UIManager,
  DeviceEventEmitter,
} from 'react-native';
import { connect } from 'react-redux';
import { withTheme } from 'react-native-paper';
import analytics from '@react-native-firebase/analytics';
import Share from 'react-native-share';
import ActionButton from 'react-native-action-button';
import { AndroidBackHandler } from 'react-navigation-backhandler';
import enhanceSaveImage from '../../components/HOC/enhanceSaveImage';
import IllustDetailContent from '../../components/IllustDetailContent';
import PXHeader from '../../components/PXHeader';
import PXViewPager from '../../components/PXViewPager';
import DetailInfoModal from '../../components/DetailInfoModal';
import PXBottomSheet from '../../components/PXBottomSheet';
import PXBottomSheetButton from '../../components/PXBottomSheetButton';
import PXBottomSheetCancelButton from '../../components/PXBottomSheetCancelButton';
import BookmarkIllustButton from '../../components/BookmarkIllustButton';
import Loader from '../../components/Loader';
import PXTouchable from '../../components/PXTouchable';
import PXThumbnail from '../../components/PXThumbnail';
import HeaderInfoButton from '../../components/HeaderInfoButton';
import HeaderSaveImageButton from '../../components/HeaderSaveImageButton';
import HeaderMenuButton from '../../components/HeaderMenuButton';
import * as browsingHistoryIllustsActionCreators from '../../common/actions/browsingHistoryIllusts';
import * as muteUsersActionCreators from '../../common/actions/muteUsers';
import * as illustDetailActionCreators from '../../common/actions/illustDetail';
import { makeGetDetailItem } from '../../common/selectors';
import { SCREENS } from '../../common/constants';
import { globalStyleVariables, globalStyles } from '../../styles';

const THUMBNAIL_SIZE = 30;

const styles = StyleSheet.create({
  content: {
    flex: 1,
    width: globalStyleVariables.WINDOW_WIDTH,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: Platform.OS === 'android' ? 'flex-start' : 'center',
    ...Platform.select({
      ios: {
        maxWidth: globalStyleVariables.WINDOW_WIDTH - 150,
      },
    }),
  },
  headerThumnailNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameContainer: {
    flexDirection: 'column',
    marginLeft: 10,
  },
  headerText: {
    color: '#fff',
  },
  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

class Detail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mounting: true,
      isActionButtonVisible: true,
      isOpenMenuBottomSheet: false,
      isOpenDetailInfoModal: false,
      selectedImageIndex: null,
    };
    this.listViewOffset = 0;
    if (Platform.OS === 'android') {
      /* eslint no-unused-expressions: ["error", { "allowShortCircuit": true }] */
      UIManager.setLayoutAnimationEnabledExperimental &&
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  componentDidMount() {
    const {
      illustId,
      item,
      isFromDeepLink,
      addBrowsingHistoryIllusts,
      fetchIllustDetail,
    } = this.props;
    InteractionManager.runAfterInteractions(() => {
      if (this.detailView) {
        this.setState({ mounting: false });
      }
      if (isFromDeepLink) {
        fetchIllustDetail(illustId);
        analytics().logEvent(`Screen_${SCREENS.Detail}`, {
          id: illustId.toString(),
          fromDeepLink: true,
        });
      } else {
        this.masterListUpdateListener = DeviceEventEmitter.addListener(
          'masterListUpdate',
          this.handleOnMasterListUpdate,
        );
        addBrowsingHistoryIllusts(item.id);
        analytics().logEvent(`Screen_${SCREENS.Detail}`, {
          id: item.id.toString(),
        });
      }
    });
  }

  componentDidUpdate(prevProps) {
    const {
      illustId,
      isFromDeepLink,
      illustDetail,
      addBrowsingHistoryIllusts,
    } = this.props;
    const { illustDetail: prevIllustDetail } = prevProps;
    if (
      illustId &&
      isFromDeepLink &&
      illustDetail?.loaded !== prevIllustDetail?.loaded &&
      illustDetail?.item
    ) {
      // only add browsing history if item is loaded for illust that open from deep link
      addBrowsingHistoryIllusts(illustId);
    }
  }

  componentWillUnmount() {
    if (this.masterListUpdateListener) {
      this.masterListUpdateListener.remove();
    }
  }

  handleOnScrollDetailImageList = (e) => {
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
    const direction =
      currentOffset > 0 && currentOffset >= this.listViewOffset ? 'down' : 'up';
    // If the user is scrolling down (and the action-button is still visible) hide it
    const isActionButtonVisible = direction === 'up' || currentOffset === 0;
    if (isActionButtonVisible !== this.state.isActionButtonVisible) {
      LayoutAnimation.configureNext(CustomLayoutLinear);
      this.setState({ isActionButtonVisible });
    }
    this.listViewOffset = currentOffset;
  };

  handleOnPressImage = (index) => {
    const { navigation, item } = this.props;
    const images =
      item.page_count > 1
        ? item.meta_pages.map((page) => page.image_urls.original)
        : [item.meta_single_page.original_image_url];
    navigation.navigate(SCREENS.ImagesViewer, {
      images,
      item,
      viewerIndex: index,
    });
  };

  handleOnLongPressImage = (index) => {
    this.handleOnPressOpenMenuBottomSheet(index);
  };

  handleOnViewPagerPageSelected = (index) => {
    const { items, addBrowsingHistoryIllusts, navigation } = this.props;
    if (this.props.index !== undefined && this.props.index !== index) {
      const { setParams } = navigation;
      setParams({
        index,
      });
      InteractionManager.runAfterInteractions(() => {
        analytics().logEvent(`Screen_${SCREENS.Detail}`, {
          id: items[index].id.toString(),
          fromSwipe: true,
        });
        addBrowsingHistoryIllusts(items[index].id);
      });
    }
  };

  handleOnListEndReached = () => {
    const { parentListKey } = this.props;
    DeviceEventEmitter.emit(`onDetailListEndReached`, {
      parentListKey,
    });
  };

  handleOnMasterListUpdate = ({ listKey, items }) => {
    const {
      parentListKey,
      navigation: { setParams },
    } = this.props;
    if (parentListKey === listKey) {
      setParams({ items });
    }
  };

  handleOnPressHeaderBackButton = () => {
    const { goBack } = this.props.navigation;
    goBack();
  };

  handleOnPressOpenMenuBottomSheet = (selectedImageIndex) => {
    const newState = {
      isOpenMenuBottomSheet: true,
    };
    if (selectedImageIndex !== null) {
      newState.selectedImageIndex = selectedImageIndex;
    }
    this.setState(newState);
  };

  handleOnCancelMenuBottomSheet = () => {
    this.setState({
      isOpenMenuBottomSheet: false,
      selectedImageIndex: null,
    });
  };

  handleOnPressToggleMuteUser = () => {
    const { item, isMuteUser, addMuteUser, removeMuteUser } = this.props;
    if (isMuteUser) {
      removeMuteUser(item.user.id);
    } else {
      addMuteUser({
        id: item.user.id,
        name: item.user.name,
        profile_image_urls: item.user.profile_image_urls,
      });
    }
    this.handleOnCancelMenuBottomSheet();
  };

  handleOnPressShareIllust = () => {
    const { item } = this.props;
    const shareOptions = {
      message: `${item.title} | ${item.user.name} #pxview`,
      url: `https://www.pixiv.net/artworks/${item.id}`,
    };
    Share.open(shareOptions)
      .then(this.handleOnCancelMenuBottomSheet)
      .catch(this.handleOnCancelMenuBottomSheet);
  };

  handleOnPressSaveImage = () => {
    const { saveImage, item } = this.props;
    const { selectedImageIndex } = this.state;
    const images =
      item.page_count > 1
        ? item.meta_pages.map((page) => page.image_urls.original)
        : [item.meta_single_page.original_image_url];
    saveImage({
      imageUrls: [images[selectedImageIndex]],
      imageIndex: selectedImageIndex,
      workId: item.id,
      workTitle: item.title,
      workType: item.type,
      userId: item.user.id,
      userName: item.user.name,
    });
    this.handleOnCancelMenuBottomSheet();
  };

  handleOnPressOpenDetailInfoModal = () => {
    this.setState({
      isOpenDetailInfoModal: true,
    });
  };

  handleOnCancelDetailInfoModal = () => {
    this.setState({
      isOpenDetailInfoModal: false,
    });
  };

  handleOnPressHardwareBackButton = () => {
    const { isOpenDetailInfoModal } = this.state;
    if (isOpenDetailInfoModal) {
      this.setState({
        isOpenDetailInfoModal: false,
      });
      return true;
    }
    return false;
  };

  renderHeaderTitle = (item) => {
    const {
      navigation: { push },
    } = this.props;
    return (
      <View style={styles.headerTitleContainer}>
        <PXTouchable
          style={styles.headerThumnailNameContainer}
          onPress={() => push(SCREENS.UserDetail, { userId: item.user.id })}
        >
          <PXThumbnail
            uri={item.user.profile_image_urls.medium}
            size={THUMBNAIL_SIZE}
          />
          <View style={styles.nameContainer}>
            <Text
              style={styles.headerText}
              ellipsizeMode="tail"
              numberOfLines={1}
            >
              {item.user.name}
            </Text>
            <Text
              style={styles.headerText}
              ellipsizeMode="tail"
              numberOfLines={1}
            >
              {item.user.account}
            </Text>
          </View>
        </PXTouchable>
      </View>
    );
  };

  renderHeaderRight = (item) => {
    const images =
      item.page_count > 1
        ? item.meta_pages.map((page) => page.image_urls.original)
        : [item.meta_single_page.original_image_url];
    return (
      <View style={styles.headerRightContainer}>
        <HeaderInfoButton onPress={this.handleOnPressOpenDetailInfoModal} />
        <HeaderSaveImageButton
          imageUrls={images}
          workId={item.id}
          workTitle={item.title}
          workType={item.type}
          userId={item.user.id}
          userName={item.user.name}
          saveAll
        />
        <HeaderMenuButton
          onPress={() => this.handleOnPressOpenMenuBottomSheet(null)}
        />
      </View>
    );
  };

  renderContent = ({ item, index: itemIndex }) => {
    const { navigation, authUser, route, index } = this.props;
    return (
      <View style={styles.content} key={item.id}>
        <PXHeader
          headerTitle={this.renderHeaderTitle(item)}
          headerRight={this.renderHeaderRight(item)}
          darkTheme
          withShadow
          showBackButton
          onPressBackButton={this.handleOnPressHeaderBackButton}
        />
        <IllustDetailContent
          item={item}
          itemIndex={itemIndex}
          currentIndex={index}
          navigation={navigation}
          route={route}
          authUser={authUser}
          onPressImage={this.handleOnPressImage}
          onLongPressImage={this.handleOnLongPressImage}
          onScroll={this.handleOnScrollDetailImageList}
        />
      </View>
    );
  };

  renderMainContent() {
    const { items, item, index, isFromDeepLink } = this.props;
    const { mounting } = this.state;
    if (mounting) {
      return <Loader />;
    }
    if (isFromDeepLink) {
      if (!item) {
        return <Loader />;
      }
      return (
        <PXViewPager
          items={[item]}
          keyExtractor={(vpItem) => vpItem.id.toString()}
          index={0}
          renderContent={this.renderContent}
          onPageSelected={this.handleOnViewPagerPageSelected}
          onEndReached={this.handleOnListEndReached}
        />
      );
    }
    return (
      <PXViewPager
        items={items}
        keyExtractor={(vpItem) => vpItem.id.toString()}
        index={index}
        renderContent={this.renderContent}
        onPageSelected={this.handleOnViewPagerPageSelected}
        onEndReached={this.handleOnListEndReached}
      />
    );
  }

  renderBookmarkButtonIcon = () => {
    const { item } = this.props;
    return <BookmarkIllustButton item={item} />;
  };

  render() {
    const { item, isMuteUser, i18n, navigation, theme, route } = this.props;
    const {
      isActionButtonVisible,
      isOpenDetailInfoModal,
      isOpenMenuBottomSheet,
      selectedImageIndex,
    } = this.state;
    return (
      <AndroidBackHandler onBackPress={this.handleOnPressHardwareBackButton}>
        <View
          style={[
            globalStyles.container,
            { backgroundColor: theme.colors.background },
          ]}
          ref={(ref) => (this.detailView = ref)}
        >
          {this.renderMainContent()}
          {isActionButtonVisible && item && (
            <ActionButton
              buttonColor="rgba(255,255,255,1)"
              bgColor="red"
              renderIcon={this.renderBookmarkButtonIcon}
              fixNativeFeedbackRadius
            />
          )}
          <DetailInfoModal
            item={item}
            navigation={navigation}
            route={route}
            visible={isOpenDetailInfoModal}
            onCancel={this.handleOnCancelDetailInfoModal}
          />
          <PXBottomSheet
            visible={isOpenMenuBottomSheet}
            onCancel={this.handleOnCancelMenuBottomSheet}
          >
            {selectedImageIndex !== null && (
              <PXBottomSheetButton
                onPress={this.handleOnPressSaveImage}
                iconName="content-save"
                iconType="material-community"
                text={i18n.saveImage}
              />
            )}
            <PXBottomSheetButton
              onPress={this.handleOnPressShareIllust}
              iconName="share"
              iconType="entypo"
              text={i18n.share}
            />
            <PXBottomSheetButton
              onPress={this.handleOnPressToggleMuteUser}
              iconName="user-times"
              iconType="font-awesome"
              textStyle={{
                marginLeft: 28,
              }}
              text={isMuteUser ? i18n.userMuteRemove : i18n.userMuteAdd}
            />
            <PXBottomSheetCancelButton
              onPress={this.handleOnCancelMenuBottomSheet}
              textStyle={{
                marginLeft: 38,
              }}
              text={i18n.cancel}
            />
          </PXBottomSheet>
        </View>
      </AndroidBackHandler>
    );
  }
}

export default withTheme(
  enhanceSaveImage(
    connect(
      () => {
        const getDetailItem = makeGetDetailItem();
        return (state, props) => {
          const item = getDetailItem(state, props);
          const isMuteUser = item
            ? state.muteUsers.items.some((m) => m.id === item.user.id)
            : false;
          const {
            illust_id: illustIdFromQS,
            illustId,
            items,
            index,
            parentListKey,
          } = props.route.params;
          const id = parseInt(illustIdFromQS || illustId, 0);
          return {
            illustId: id || item.id,
            illustDetail: state.illustDetail[id], // get illustDetail from api if load from deep link
            item,
            isMuteUser,
            isFromDeepLink: !!id,
            items,
            index,
            parentListKey,
            authUser: state.auth.user,
          };
        };
      },
      {
        ...browsingHistoryIllustsActionCreators,
        ...muteUsersActionCreators,
        ...illustDetailActionCreators,
      },
    )(Detail),
  ),
);
