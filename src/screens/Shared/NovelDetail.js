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
import Share from 'react-native-share';
import ActionButton from 'react-native-action-button';
import enhanceSaveImage from '../../components/HOC/enhanceSaveImage';
import NovelDetailContent from '../../components/NovelDetailContent';
import PXHeader from '../../components/PXHeader';
import PXViewPager from '../../components/PXViewPager';
import PXBottomSheet from '../../components/PXBottomSheet';
import PXBottomSheetButton from '../../components/PXBottomSheetButton';
import PXBottomSheetCancelButton from '../../components/PXBottomSheetCancelButton';
import BookmarkNovelButton from '../../components/BookmarkNovelButton';
import Loader from '../../components/Loader';
import PXTouchable from '../../components/PXTouchable';
import PXThumbnail from '../../components/PXThumbnail';
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
      } else {
        this.masterListUpdateListener = DeviceEventEmitter.addListener(
          'masterListUpdate',
          this.handleOnMasterListUpdate,
        );
        addBrowsingHistoryNovels(item.id);
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    const { novelDetail: prevIllustDetail } = this.props;
    const {
      novelId,
      isFromDeepLink,
      novelDetail,
      addBrowsingHistoryNovels,
    } = nextProps;
    if (
      novelId &&
      isFromDeepLink &&
      novelDetail &&
      novelDetail.loaded &&
      novelDetail.loaded !== prevIllustDetail.prevLoaded &&
      novelDetail.item
    ) {
      // only add browsing history if item is loaded for novel that open from deep link
      addBrowsingHistoryNovels(novelId);
    }
  }

  componentWillUnmount() {
    if (this.masterListUpdateListener) {
      this.masterListUpdateListener.remove();
    }
  }

  handleOnScrollDetailImageList = e => {
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

  handleOnPressImage = index => {
    const { navigation, item } = this.props;
    const images =
      item.page_count > 1
        ? item.meta_pages.map(page => page.image_urls.original)
        : [item.meta_single_page.original_image_url];
    navigation.navigate(SCREENS.ImagesViewer, {
      images,
      viewerIndex: index,
    });
  };

  handleOnLongPressImage = () => {
    this.handleOnPressOpenMenuBottomSheet();
  };

  handleOnViewPagerPageSelected = index => {
    const { items, addBrowsingHistoryNovels, navigation } = this.props;
    if (this.props.index !== undefined && this.props.index !== index) {
      const { setParams } = navigation;
      setParams({
        index,
      });
      InteractionManager.runAfterInteractions(() => {
        addBrowsingHistoryNovels(items[index].id);
      });
    }
  };

  handleOnListEndReached = () => {
    const { onListEndReached } = this.props;
    if (onListEndReached) {
      onListEndReached();
    }
  };

  handleOnMasterListUpdate = ({ listKey, items }) => {
    const { parentListKey, navigation: { setParams } } = this.props;
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
      addMuteUser(item.user.id);
    }
    this.handleOnCancelMenuBottomSheet();
  };

  handleOnPressShareNovel = () => {
    const { item } = this.props;
    const shareOptions = {
      message: `${item.title} | ${item.user.name} #pxview`,
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
    const { item, navigation: { navigate } } = this.props;
    navigate(SCREENS.NovelReader, {
      novelId: item.id,
    });
  };

  renderHeaderTitle = item => {
    const { navigation: { push } } = this.props;
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

  renderHeaderRight = item =>
    <View style={styles.headerRightContainer}>
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
    </View>;

  renderContent = ({ item }) => {
    const { navigation, authUser } = this.props;
    return (
      <View key={item.id} style={styles.content}>
        <PXHeader
          headerTitle={this.renderHeaderTitle(item)}
          headerRight={this.renderHeaderRight(item)}
          darkTheme
          showBackButton
          onPressBackButton={this.handleOnPressHeaderBackButton}
        />
        <NovelDetailContent
          item={item}
          navigation={navigation}
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
          keyExtractor={vpItem => vpItem.id.toString()}
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
        keyExtractor={vpItem => vpItem.id.toString()}
        index={index}
        renderContent={this.renderContent}
        onPageSelected={this.handleOnViewPagerPageSelected}
        onEndReached={this.handleOnListEndReached}
      />
    );
  }

  render() {
    const { item, isMuteUser, i18n } = this.props;
    const { isActionButtonVisible, isOpenMenuBottomSheet } = this.state;
    return (
      <View style={globalStyles.container} ref={ref => (this.detailView = ref)}>
        {this.renderMainContent()}
        {isActionButtonVisible &&
          item &&
          <ActionButton
            buttonColor="rgba(255,255,255,1)"
            bgColor="red"
            icon={<BookmarkNovelButton item={item} />}
            fixNativeFeedbackRadius
          />}
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
    );
  }
}

export default enhanceSaveImage(
  connect(
    () => {
      const getDetailItem = makeGetDetailNovelItem();
      return (state, props) => {
        const item = getDetailItem(state, props);
        const isMuteUser = item
          ? state.muteUsers.items.some(m => m === item.user.id)
          : false;
        const {
          id: novelIdFromQS,
          novelId,
          items,
          index,
          onListEndReached,
          parentListKey,
        } = props.navigation.state.params;
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
);
