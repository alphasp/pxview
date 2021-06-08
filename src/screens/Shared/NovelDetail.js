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
import NovelDetailContent from '../../components/NovelDetailContent';
import PXHeader from '../../components/PXHeader';
import PXViewPager from '../../components/PXViewPager';
import DetailInfoModal from '../../components/DetailInfoModal';
import PXBottomSheet from '../../components/PXBottomSheet';
import PXBottomSheetButton from '../../components/PXBottomSheetButton';
import PXBottomSheetCancelButton from '../../components/PXBottomSheetCancelButton';
import BookmarkNovelButton from '../../components/BookmarkNovelButton';
import Loader from '../../components/Loader';
import PXTouchable from '../../components/PXTouchable';
import PXThumbnail from '../../components/PXThumbnail';
import HeaderInfoButton from '../../components/HeaderInfoButton';
import HeaderSaveImageButton from '../../components/HeaderSaveImageButton';
import HeaderMenuButton from '../../components/HeaderMenuButton';
import * as browsingHistoryNovelsActionCreators from '../../common/actions/browsingHistoryNovels';
import * as muteUsersActionCreators from '../../common/actions/muteUsers';
import * as novelDetailActionCreators from '../../common/actions/novelDetail';
import { makeGetDetailNovelItem } from '../../common/selectors';
import { SCREENS } from '../../common/constants';
import { globalStyles, globalStyleVariables } from '../../styles';

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
  image: {
    resizeMode: 'contain',
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

class NovelDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mounting: true,
      isActionButtonVisible: true,
      isOpenMenuBottomSheet: false,
      isOpenDetailInfoModal: false,
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
      novelId,
      item,
      isFromDeepLink,
      addBrowsingHistoryNovels,
      fetchNovelDetail,
    } = this.props;
    InteractionManager.runAfterInteractions(() => {
      if (this.detailView) {
        this.setState({ mounting: false });
      }
      if (isFromDeepLink) {
        fetchNovelDetail(novelId);
        analytics().logEvent(`Screen_${SCREENS.NovelDetail}`, {
          id: novelId.toString(),
          fromDeepLink: true,
        });
      } else {
        this.masterListUpdateListener = DeviceEventEmitter.addListener(
          'masterListUpdate',
          this.handleOnMasterListUpdate,
        );
        analytics().logEvent(`Screen_${SCREENS.NovelDetail}`, {
          id: item.id.toString(),
        });
        addBrowsingHistoryNovels(item.id);
      }
    });
  }

  componentDidUpdate(prevProps) {
    const {
      novelId,
      isFromDeepLink,
      novelDetail,
      addBrowsingHistoryNovels,
    } = this.props;
    const { novelDetail: prevNovelDetail } = prevProps;
    if (
      novelId &&
      isFromDeepLink &&
      novelDetail?.loaded !== prevNovelDetail?.loaded &&
      novelDetail?.item
    ) {
      // only add browsing history if item is loaded for novel that open from deep link
      addBrowsingHistoryNovels(novelId);
    }
  }

  componentWillUnmount() {
    if (this.masterListUpdateListener) {
      this.masterListUpdateListener.remove();
    }
    if (this.navigationListener) {
      this.navigationListener();
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

  handleOnLongPressImage = () => {
    this.handleOnPressOpenMenuBottomSheet();
  };

  handleOnViewPagerPageSelected = (index) => {
    const { items, addBrowsingHistoryNovels, navigation } = this.props;
    if (this.props.index !== undefined && this.props.index !== index) {
      const { setParams } = navigation;
      setParams({
        index,
      });
      InteractionManager.runAfterInteractions(() => {
        addBrowsingHistoryNovels(items[index].id);
        analytics().logEvent(`Screen_${SCREENS.NovelDetail}`, {
          id: items[index].id.toString(),
          fromSwipe: true,
        });
      });
    }
  };

  handleOnListEndReached = () => {
    const { parentListKey } = this.props;
    DeviceEventEmitter.emit(`onNovelDetailListEndReached`, {
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

  handleOnPressOpenMenuBottomSheet = () => {
    this.setState({ isOpenMenuBottomSheet: true });
  };

  handleOnCancelMenuBottomSheet = () => {
    this.setState({
      isOpenMenuBottomSheet: false,
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

  handleOnPressShareNovel = () => {
    const { item } = this.props;
    const shareOptions = {
      message: `${item.title} | ${item.user.name} #pxviewr`,
      url: `https://www.pixiv.net/novel/show.php?id=${item.id}`,
    };
    Share.open(shareOptions)
      .then(this.handleOnCancelMenuBottomSheet)
      .catch(this.handleOnCancelMenuBottomSheet);
  };

  handleOnPressSaveImage = () => {
    const { saveImage, item } = this.props;
    saveImage({
      imageUrls: [item.image_urls.large],
      imageIndex: 0,
      workId: item.id,
      workTitle: item.title,
      workType: item.type,
      userId: item.user.id,
      userName: item.user.name,
    });
    this.handleOnCancelMenuBottomSheet();
  };

  handleOnPressNovelImage = () => {
    const {
      item,
      navigation: { push },
    } = this.props;
    push(SCREENS.NovelReader, {
      novelId: item.id,
    });
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

  renderHeaderRight = (item) => (
    <View style={styles.headerRightContainer}>
      <HeaderInfoButton onPress={this.handleOnPressOpenDetailInfoModal} />
      <HeaderSaveImageButton
        imageUrls={[item.image_urls.large]}
        imageIndex={0}
        workId={item.id}
        workTitle={item.title}
        workType={item.type}
        userId={item.user.id}
        userName={item.user.name}
      />
      <HeaderMenuButton onPress={this.handleOnPressOpenMenuBottomSheet} />
    </View>
  );

  renderContent = ({ item, index: itemIndex }) => {
    const { navigation, authUser, route, index } = this.props;
    return (
      <View key={item.id} style={styles.content}>
        <PXHeader
          headerTitle={this.renderHeaderTitle(item)}
          headerRight={this.renderHeaderRight(item)}
          darkTheme
          withShadow
          showBackButton
          onPressBackButton={this.handleOnPressHeaderBackButton}
        />
        <NovelDetailContent
          item={item}
          itemIndex={itemIndex}
          currentIndex={index}
          navigation={navigation}
          route={route}
          authUser={authUser}
          onLongPressImage={this.handleOnLongPressImage}
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
    return <BookmarkNovelButton item={item} />;
  };

  render() {
    const { item, isMuteUser, i18n, navigation, route, theme } = this.props;
    const {
      isActionButtonVisible,
      isOpenMenuBottomSheet,
      isOpenDetailInfoModal,
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
            <PXBottomSheetButton
              onPress={this.handleOnPressSaveImage}
              iconName="content-save"
              iconType="material-community"
              text={i18n.saveImage}
            />
            <PXBottomSheetButton
              onPress={this.handleOnPressShareNovel}
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
        const getDetailItem = makeGetDetailNovelItem();
        return (state, props) => {
          const item = getDetailItem(state, props);
          const isMuteUser = item
            ? state.muteUsers.items.some((m) => m.id === item.user.id)
            : false;
          const {
            id: novelIdFromQS,
            novelId,
            items,
            index,
            onListEndReached,
            parentListKey,
          } = props.route.params;
          const id = parseInt(novelIdFromQS || novelId, 0);
          return {
            novelId: id || item.id,
            novelDetail: state.novelDetail[id], // get novelDetail from api if load from deep link
            item,
            isMuteUser,
            isFromDeepLink: !!id,
            items,
            index,
            onListEndReached,
            parentListKey,
            authUser: state.auth.user,
          };
        };
      },
      {
        ...browsingHistoryNovelsActionCreators,
        ...muteUsersActionCreators,
        ...novelDetailActionCreators,
      },
    )(NovelDetail),
  ),
);
