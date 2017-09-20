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
import DetailImageList from '../../components/DetailImageList';
import { connectLocalization } from '../../components/Localization';
import PXHeader from '../../components/PXHeader';
import PXViewPager from '../../components/PXViewPager';
import PXBottomSheet from '../../components/PXBottomSheet';
import PXBottomSheetButton from '../../components/PXBottomSheetButton';
import PXBottomSheetCancelButton from '../../components/PXBottomSheetCancelButton';
import BookmarkButton from '../../components/BookmarkButton';
import Loader from '../../components/Loader';
import PXTouchable from '../../components/PXTouchable';
import PXThumbnail from '../../components/PXThumbnail';
import HeaderSaveImageButton from '../../components/HeaderSaveImageButton';
import HeaderMenuButton from '../../components/HeaderMenuButton';
import * as browsingHistoryActionCreators from '../../common/actions/browsingHistory';
import * as muteUsersActionCreators from '../../common/actions/muteUsers';
import { makeGetDetailItem } from '../../common/selectors';
import { SCREENS } from '../../common/constants';

const THUMBNAIL_SIZE = 30;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: Platform.OS === 'android' ? 'flex-start' : 'center',
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
    };
    this.listViewOffset = 0;
    if (Platform.OS === 'android') {
      /* eslint no-unused-expressions: ["error", { "allowShortCircuit": true }] */
      UIManager.setLayoutAnimationEnabledExperimental &&
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  componentDidMount() {
    const { item, addBrowsingHistory } = this.props;
    InteractionManager.runAfterInteractions(() => {
      if (this.detailView) {
        this.setState({ mounting: false });
      }
      addBrowsingHistory(item.id);
    });
    this.masterListUpdateListener = DeviceEventEmitter.addListener(
      'masterListUpdate',
      this.handleOnMasterListUpdate,
    );
  }

  componentWillUnmount() {
    this.masterListUpdateListener.remove();
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

  handleOnViewPagerPageSelected = index => {
    const { items, addBrowsingHistory, navigation } = this.props;
    if (this.props.index !== index) {
      const { setParams } = navigation;
      setParams({
        index,
      });
      InteractionManager.runAfterInteractions(() => {
        addBrowsingHistory(items[index].id);
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
    this.setState({
      isOpenMenuBottomSheet: true,
    });
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

  handleOnPressShareIllust = () => {
    const { item } = this.props;
    const shareOptions = {
      message: `${item.title} | ${item.user.name} #pxview`,
      url: `http://www.pixiv.net/member_illust.php?illust_id=${item.id}&mode=medium`,
    };
    Share.open(shareOptions)
      .then(this.handleOnCancelMenuBottomSheet)
      .catch(this.handleOnCancelMenuBottomSheet);
  };

  renderHeaderTitle = item => {
    const { navigation: { navigate } } = this.props;
    return (
      <View style={styles.headerTitleContainer}>
        <PXTouchable
          style={styles.headerThumnailNameContainer}
          onPress={() => navigate(SCREENS.UserDetail, { userId: item.user.id })}
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

  renderHeaderRight = item => {
    const images =
      item.page_count > 1
        ? item.meta_pages.map(page => page.image_urls.original)
        : [item.meta_single_page.original_image_url];
    return (
      <View style={styles.headerRightContainer}>
        <HeaderSaveImageButton imageUrls={images} saveAll />
        <HeaderMenuButton onPress={this.handleOnPressOpenMenuBottomSheet} />
      </View>
    );
  };

  renderContent = ({ item }) => {
    const { navigation, i18n, authUser } = this.props;
    return (
      <View key={item.id}>
        <PXHeader
          headerTitle={this.renderHeaderTitle(item)}
          headerRight={this.renderHeaderRight(item)}
          darkTheme
          showBackButton
          onPressBackButton={this.handleOnPressHeaderBackButton}
        />
        <DetailImageList
          item={item}
          navigation={navigation}
          i18n={i18n}
          authUser={authUser}
          onPressImage={this.handleOnPressImage}
          onScroll={this.handleOnScrollDetailImageList}
        />
      </View>
    );
  };

  render() {
    const { items, item, index, isMuteUser, i18n } = this.props;
    const {
      mounting,
      isActionButtonVisible,
      isOpenMenuBottomSheet,
    } = this.state;
    return (
      <View style={styles.container} ref={ref => (this.detailView = ref)}>
        {mounting
          ? <Loader />
          : <PXViewPager
              items={items}
              index={index}
              renderContent={this.renderContent}
              onPageSelected={this.handleOnViewPagerPageSelected}
              onEndReached={this.handleOnListEndReached}
            />}
        {isActionButtonVisible &&
          <ActionButton
            buttonColor="rgba(255,255,255,1)"
            bgColor="red"
            icon={<BookmarkButton item={item} />}
          />}
        <PXBottomSheet
          visible={isOpenMenuBottomSheet}
          onCancel={this.handleOnCancelMenuBottomSheet}
        >
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
    );
  }
}

export default connectLocalization(
  connect(
    () => {
      const getDetailItem = makeGetDetailItem();
      return (state, props) => {
        const item = getDetailItem(state, props);
        const isMuteUser = state.muteUsers.items.some(m => m === item.user.id);
        return {
          item,
          isMuteUser,
          items: props.navigation.state.params.items,
          index: props.navigation.state.params.index,
          onListEndReached: props.navigation.state.params.onListEndReached,
          parentListKey: props.navigation.state.params.parentListKey,
          authUser: state.auth.user,
        };
      };
    },
    { ...browsingHistoryActionCreators, ...muteUsersActionCreators },
  )(Detail),
);
