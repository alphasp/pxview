import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Linking,
  RefreshControl,
  Platform,
  InteractionManager,
} from 'react-native';
import { connect } from 'react-redux';
import Hyperlink from 'react-native-hyperlink';
import Icon from 'react-native-vector-icons/FontAwesome';
import truncate from 'lodash.truncate';
import * as Animatable from 'react-native-animatable';
import Share from 'react-native-share';
import FollowButtonContainer from '../../containers/FollowButtonContainer';
import { connectLocalization } from '../../components/Localization';
import PXHeader from '../../components/PXHeader';
import IllustCollection from '../../components/IllustCollection';
import NovelCollection from '../../components/NovelCollection';
import PXThumbnail from '../../components/PXThumbnail';
import PXThumbnailTouchable from '../../components/PXThumbnailTouchable';
import PXImage from '../../components/PXImage';
import PXBottomSheet from '../../components/PXBottomSheet';
import PXBottomSheetButton from '../../components/PXBottomSheetButton';
import PXBottomSheetCancelButton from '../../components/PXBottomSheetCancelButton';
import HeaderMenuButton from '../../components/HeaderMenuButton';
import Loader from '../../components/Loader';
import * as userDetailActionCreators from '../../common/actions/userDetail';
import * as userIllustsActionCreators from '../../common/actions/userIllusts';
import * as userMangasActionCreators from '../../common/actions/userMangas';
import * as userNovelsActionCreators from '../../common/actions/userNovels';
import * as userBookmarkIllustsActionCreators from '../../common/actions/userBookmarkIllusts';
import * as userBookmarkNovelsActionCreators from '../../common/actions/userBookmarkNovels';
import * as muteUsersActionCreators from '../../common/actions/muteUsers';
import { makeGetUserDetailPageItems } from '../../common/selectors';
import { SCREENS } from '../../common/constants';
import { globalStyleVariables } from '../../styles';

const avatarSize = 70;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E9EBEE',
  },
  coverOuterContainer: {
    height: 150,
  },
  avatarContainer: {
    position: 'absolute',
    bottom: -(avatarSize / 2),
    width: globalStyleVariables.WINDOW_WIDTH,
    alignItems: 'center',
  },
  profileContainer: {
    flex: 1,
    alignItems: 'center',
  },
  userName: {
    fontSize: 20,
  },
  statType: {
    color: '#90949c',
  },
  row: {
    flexDirection: 'row',
  },
  infoContainer: {
    backgroundColor: '#fff',
    margin: 10,
    borderRadius: 5,
  },
  commentContainer: {
    padding: 10,
  },
  hyperlink: {
    color: '#2980b9',
  },
  externalLink: {
    color: '#90949c',
    fontWeight: 'bold',
  },
  icon: {
    fontSize: 16,
    color: '#90949c',
    marginHorizontal: 5,
  },
  navbarHeader: {
    margin: 10,
    ...Platform.select({
      ios: {
        top: 15,
      },
    }),
    alignItems: 'center',
    opacity: 0,
  },
  thumnailNameContainer: {
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
  followButton: {
    borderColor: '#fff',
  },
  followButtonText: {
    color: '#fff',
  },
});

class UserDetail extends Component {
  static defaultProps = {
    userDetail: { refreshing: false },
    userIllusts: {},
    userMangas: {},
    userNovels: {},
    userBookmarkIllusts: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      isScrolled: false,
      isShowTitle: false,
      isOpenMenuBottomSheet: false,
    };
  }

  componentDidMount() {
    const { userDetail } = this.props;
    InteractionManager.runAfterInteractions(() => {
      if (!userDetail || !userDetail.item) {
        this.fetchUserInfos();
      }
    });
  }

  fetchUserInfos = () => {
    const {
      userId,
      fetchUserDetail,
      clearUserDetail,
      fetchUserIllusts,
      clearUserIllusts,
      fetchUserMangas,
      clearUserMangas,
      fetchUserNovels,
      clearUserNovels,
      fetchUserBookmarkIllusts,
      clearUserBookmarkIllusts,
      fetchUserBookmarkNovels,
      clearUserBookmarkNovels,
    } = this.props;
    clearUserDetail(userId);
    clearUserIllusts(userId);
    clearUserMangas(userId);
    clearUserNovels(userId);
    clearUserBookmarkIllusts(userId);
    clearUserBookmarkNovels(userId);
    fetchUserDetail(userId);
    fetchUserIllusts(userId);
    fetchUserMangas(userId);
    fetchUserNovels(userId);
    fetchUserBookmarkIllusts(userId);
    fetchUserBookmarkNovels(userId);
  };

  handleOnLinkPress = url => {
    Linking.canOpenURL(url)
      .then(supported => {
        if (!supported) {
          return null;
        }
        return Linking.openURL(url);
      })
      .catch(err => err);
  };

  handleOnRefresh = () => {
    this.fetchUserInfos();
  };

  handleOnScroll = ({ nativeEvent }) => {
    const { userDetail } = this.props;
    const { isShowTitle, isScrolled } = this.state;
    let newState;
    if (userDetail && userDetail.item) {
      if (nativeEvent.contentOffset.y >= 135) {
        if (!isScrolled) {
          if (!isShowTitle) {
            newState = {
              isScrolled: true,
              isShowTitle: true,
            };
          } else {
            newState = {
              isScrolled: true,
            };
          }
        } else if (!isShowTitle) {
          newState = {
            isShowTitle: true,
          };
        }
      } else if (isShowTitle) {
        newState = {
          isShowTitle: false,
        };
      }
      if (newState) {
        this.setState(newState);
      }
    }
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

  handleOnPressShareUser = () => {
    const { user } = this.props.userDetailItem;
    const shareOptions = {
      message: `${user.name} #pxview`,
      url: `http://www.pixiv.net/member.php?id=${user.id}`,
    };
    Share.open(shareOptions)
      .then(this.handleOnCancelMenuBottomSheet)
      .catch(this.handleOnCancelMenuBottomSheet);
  };

  handleOnPressToggleMuteUser = () => {
    const { userId, isMuteUser, addMuteUser, removeMuteUser } = this.props;
    if (isMuteUser) {
      removeMuteUser(userId);
    } else {
      addMuteUser(userId);
    }
    this.handleOnCancelMenuBottomSheet();
  };

  renderHeaderTitle = () => {
    const { userDetailItem } = this.props;
    const { isShowTitle, isScrolled } = this.state;
    if (!userDetailItem || !userDetailItem.user) {
      return null;
    }
    const { user } = userDetailItem;
    return (
      <Animatable.View
        style={[
          styles.thumnailNameContainer,
          {
            opacity: isScrolled ? 1 : 0,
            flex: 1,
            justifyContent: Platform.OS === 'android' ? 'flex-start' : 'center',
          },
        ]}
        // eslint-disable-next-line no-nested-ternary
        animation={isScrolled ? (isShowTitle ? 'fadeIn' : 'fadeOut') : null}
        duration={100}
      >
        <PXThumbnailTouchable uri={user.profile_image_urls.medium} />
        <View style={styles.nameContainer}>
          <Text
            style={styles.headerText}
            ellipsizeMode="tail"
            numberOfLines={1}
          >
            {user.name}
          </Text>
          <Text
            style={styles.headerText}
            ellipsizeMode="tail"
            numberOfLines={1}
          >
            {user.account}
          </Text>
        </View>
      </Animatable.View>
    );
  };

  renderHeaderRight = () => {
    const { userDetailItem, authUser } = this.props;
    if (!userDetailItem || !userDetailItem.user) {
      return null;
    }
    const { user } = userDetailItem;
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        {user &&
          ((authUser && user.id !== authUser.id) || !authUser) &&
          <FollowButtonContainer
            userId={user.id}
            buttonStyle={styles.followButton}
            textStyle={styles.followButtonText}
          />}
        <HeaderMenuButton
          onPress={this.handleOnPressOpenMenuBottomSheet}
          style={{ marginLeft: 10 }}
        />
      </View>
    );
  };

  renderProfile = detail => {
    const { i18n } = this.props;
    return (
      <View>
        <View style={styles.coverOuterContainer}>
          <View style={styles.coverInnerContainer}>
            <PXImage
              uri={detail.user.profile_image_urls.medium}
              style={{
                resizeMode: 'cover',
                width: globalStyleVariables.WINDOW_WIDTH,
                height: 100,
                backgroundColor: 'transparent',
              }}
              blurRadius={Platform.OS === 'android' ? 1 : 5}
            />
            <View style={styles.avatarContainer}>
              <PXThumbnail
                uri={detail.user.profile_image_urls.medium}
                size={avatarSize}
              />
            </View>
          </View>
        </View>
        <View style={styles.profileContainer}>
          <Text style={styles.userName}>
            {detail.user.name}
          </Text>
          <View style={{ flexDirection: 'row' }}>
            {detail.profile.webpage
              ? <View style={styles.row}>
                  <Icon name="home" style={styles.icon} />
                  <Hyperlink
                    linkStyle={styles.externalLink}
                    linkText={truncate(
                      detail.profile.webpage.replace(/https?:\/\//i, ''),
                      { length: 15 },
                    )}
                    onPress={url => this.handleOnLinkPress(url)}
                  >
                    <Text style={styles.stat}>
                      {detail.profile.webpage}
                    </Text>
                  </Hyperlink>
                </View>
              : null}
            {detail.profile.twitter_account
              ? <View style={styles.row}>
                  <Icon name="twitter" style={styles.icon} />
                  <Hyperlink
                    linkStyle={styles.externalLink}
                    linkText={detail.profile.twitter_account}
                    onPress={url => this.handleOnLinkPress(url)}
                  >
                    <Text style={styles.stat}>
                      {detail.profile.twitter_url}
                    </Text>
                  </Hyperlink>
                </View>
              : null}
          </View>
          <View style={styles.row}>
            <View style={styles.row}>
              <Text>
                {detail.profile.total_follow_users}
              </Text>
              <Text style={styles.statType}>
                {' '}{i18n.following}{' '}
              </Text>
            </View>
            <View style={styles.row}>
              <Text>
                {detail.profile.total_follower}
              </Text>
              <Text style={styles.statType}>
                {' '}{i18n.followers}{' '}
              </Text>
            </View>
            <View style={styles.row}>
              <Text>
                {detail.profile.total_mypixiv_users}
              </Text>
              <Text style={styles.statType}>
                {' '}{i18n.myPixiv}{' '}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.infoContainer}>
          <View style={styles.commentContainer}>
            <Hyperlink
              linkStyle={styles.hyperlink}
              onPress={url => this.handleOnLinkPress(url)}
            >
              <Text selectable>
                {detail.user.comment}
              </Text>
            </Hyperlink>
          </View>
        </View>
      </View>
    );
  };

  renderIllustCollection = (items, profile) => {
    const { userId, navigation, i18n } = this.props;
    return (
      <IllustCollection
        title={i18n.userIllusts}
        total={profile.total_illusts}
        viewMoreTitle={i18n.worksCount}
        items={items}
        maxItems={6}
        onPressViewMore={() =>
          navigation.navigate(SCREENS.UserIllusts, { userId })}
        navigation={navigation}
      />
    );
  };

  renderMangaCollection = (items, profile) => {
    const { userId, navigation, i18n } = this.props;
    return (
      <IllustCollection
        title={i18n.userMangas}
        total={profile.total_manga}
        viewMoreTitle={i18n.worksCount}
        items={items}
        maxItems={6}
        onPressViewMore={() =>
          navigation.navigate(SCREENS.UserMangas, { userId })}
        navigation={navigation}
      />
    );
  };

  renderNovelCollection = (items, profile) => {
    const { userId, navigation, i18n } = this.props;
    return (
      <NovelCollection
        title={i18n.userNovels}
        total={profile.total_novels}
        viewMoreTitle={i18n.worksCount}
        items={items}
        maxItems={3}
        onPressViewMore={() =>
          navigation.navigate(SCREENS.UserNovels, { userId })}
      />
    );
  };

  renderBookmarkIllusts = items => {
    const { userId, navigation, i18n } = this.props;
    return (
      <IllustCollection
        title={i18n.illustMangaCollection}
        viewMoreTitle={i18n.list}
        items={items}
        maxItems={6}
        onPressViewMore={() =>
          navigation.navigate(SCREENS.UserBookmarkIllusts, { userId })}
        navigation={navigation}
      />
    );
  };

  renderBookmarkNovels = items => {
    const { userId, navigation, i18n } = this.props;
    return (
      <NovelCollection
        title={i18n.novelCollection}
        viewMoreTitle={i18n.list}
        items={items}
        maxItems={3}
        onPressViewMore={() =>
          navigation.navigate(SCREENS.UserBookmarkNovels, { userId })}
      />
    );
  };

  renderContent = detail => {
    const {
      userIllusts,
      userMangas,
      userNovels,
      userBookmarkIllusts,
      userBookmarkNovels,
      userIllustsItems,
      userMangasItems,
      userNovelsItems,
      userBookmarkIllustsItems,
      userBookmarkNovelsItems,
    } = this.props;
    return (
      <SafeAreaView>
        {this.renderProfile(detail)}
        {userIllusts &&
        !userIllusts.loading &&
        userIllusts.items &&
        userIllusts.items.length
          ? this.renderIllustCollection(userIllustsItems, detail.profile)
          : null}
        {userMangas &&
        !userMangas.loading &&
        userMangas.items &&
        userMangas.items.length
          ? this.renderMangaCollection(userMangasItems, detail.profile)
          : null}
        {userNovels &&
        !userNovels.loading &&
        userNovels.items &&
        userNovels.items.length
          ? this.renderNovelCollection(userNovelsItems, detail.profile)
          : null}
        {userBookmarkIllusts &&
        !userBookmarkIllusts.loading &&
        userBookmarkIllusts.items &&
        userBookmarkIllusts.items.length
          ? this.renderBookmarkIllusts(userBookmarkIllustsItems)
          : null}
        {userBookmarkNovels &&
        !userBookmarkNovels.loading &&
        userBookmarkNovels.items &&
        userBookmarkNovels.items.length
          ? this.renderBookmarkNovels(userBookmarkNovelsItems)
          : null}
      </SafeAreaView>
    );
  };

  render() {
    const {
      userDetail: { loaded, loading, refreshing, item },
      userDetailItem,
      userId,
      authUser,
      isMuteUser,
      i18n,
    } = this.props;
    const { isOpenMenuBottomSheet } = this.state;
    return (
      <View style={styles.container}>
        <PXHeader
          headerTitle={this.renderHeaderTitle()}
          headerRight={this.renderHeaderRight()}
          darkTheme
          showBackButton
          onPressBackButton={this.handleOnPressHeaderBackButton}
        />
        {(!item || (!loaded && loading)) && <Loader />}
        {item
          ? <ScrollView
              onScroll={this.handleOnScroll}
              scrollEventThrottle={16}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={this.handleOnRefresh}
                />
              }
            >
              {this.renderContent(userDetailItem)}
            </ScrollView>
          : null}
        <PXBottomSheet
          visible={isOpenMenuBottomSheet}
          onCancel={this.handleOnCancelMenuBottomSheet}
        >
          <PXBottomSheetButton
            onPress={this.handleOnPressShareUser}
            iconName="share"
            iconType="entypo"
            text={i18n.share}
          />
          {((authUser && userId !== authUser.id) || !authUser) &&
            <PXBottomSheetButton
              onPress={this.handleOnPressToggleMuteUser}
              iconName="user-times"
              iconType="font-awesome"
              textStyle={{
                marginLeft: 28,
              }}
              text={isMuteUser ? i18n.userMuteRemove : i18n.userMuteAdd}
            />}
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
      const getUserDetailPageItem = makeGetUserDetailPageItems();
      return (state, props) => {
        const {
          auth,
          userDetail,
          userIllusts,
          userMangas,
          userNovels,
          userBookmarkIllusts,
          userBookmarkNovels,
          muteUsers,
        } = state;
        const userId =
          props.userId ||
          props.navigation.state.params.userId ||
          parseInt(
            props.navigation.state.params.id ||
              props.navigation.state.params.uid,
            10,
          );
        const {
          userDetailItem,
          userIllustsItems,
          userMangasItems,
          userNovelsItems,
          userBookmarkIllustsItems,
          userBookmarkNovelsItems,
        } = getUserDetailPageItem(state, props);
        const isMuteUser = muteUsers.items.some(m => m === userId);
        return {
          authUser: auth.user,
          userDetail: userDetail[userId],
          userIllusts: userIllusts[userId],
          userMangas: userMangas[userId],
          userNovels: userNovels[userId],
          userBookmarkIllusts: userBookmarkIllusts[userId],
          userBookmarkNovels: userBookmarkNovels[userId],
          userDetailItem,
          userIllustsItems,
          userMangasItems,
          userNovelsItems,
          userBookmarkIllustsItems,
          userBookmarkNovelsItems,
          userId,
          isMuteUser,
        };
      };
    },
    {
      ...userDetailActionCreators,
      ...userIllustsActionCreators,
      ...userMangasActionCreators,
      ...userNovelsActionCreators,
      ...userBookmarkIllustsActionCreators,
      ...userBookmarkNovelsActionCreators,
      ...muteUsersActionCreators,
    },
  )(UserDetail),
);
