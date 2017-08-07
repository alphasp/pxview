import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Linking,
  RefreshControl,
  Platform,
  findNodeHandle,
  InteractionManager,
} from 'react-native';
import { connect } from 'react-redux';
import Hyperlink from 'react-native-hyperlink';
import Icon from 'react-native-vector-icons/FontAwesome';
import truncate from 'lodash.truncate';
import * as Animatable from 'react-native-animatable';
import { BlurView } from 'react-native-blur';
import Share from 'react-native-share';
import FollowButtonContainer from '../../containers/FollowButtonContainer';
import { connectLocalization } from '../../components/Localization';
import PXHeader from '../../components/PXHeader';
import IllustCollection from '../../components/IllustCollection';
import HeaderShareButton from '../../components/HeaderShareButton';
import PXThumbnail from '../../components/PXThumbnail';
import PXThumbnailTouchable from '../../components/PXThumbnailTouchable';
import PXImage from '../../components/PXImage';
import Loader from '../../components/Loader';
import * as userDetailActionCreators from '../../common/actions/userDetail';
import * as userIllustsActionCreators from '../../common/actions/userIllusts';
import * as userMangasActionCreators from '../../common/actions/userMangas';
import * as userBookmarkIllustlActionCreators from '../../common/actions/userBookmarkIllusts';
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
  blurView: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
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
    userBookmarkIllusts: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      viewRef: 0,
      isScrolled: false,
      isShowTitle: false,
    };
  }

  componentDidMount() {
    const {
      userId,
      userDetail,
      fetchUserDetail,
      clearUserDetail,
      fetchUserIllusts,
      clearUserIllusts,
      fetchUserMangas,
      clearUserMangas,
      fetchUserBookmarkIllusts,
      clearUserBookmarkIllusts,
    } = this.props;
    InteractionManager.runAfterInteractions(() => {
      if (!userDetail || !userDetail.item) {
        clearUserDetail(userId);
        clearUserIllusts(userId);
        clearUserMangas(userId);
        clearUserBookmarkIllusts(userId);
        fetchUserDetail(userId);
        fetchUserIllusts(userId);
        fetchUserMangas(userId);
        fetchUserBookmarkIllusts(userId);
      }
    });
  }

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
    const {
      userId,
      fetchUserDetail,
      clearUserDetail,
      fetchUserIllusts,
      clearUserIllusts,
      fetchUserMangas,
      clearUserMangas,
      fetchUserBookmarkIllusts,
      clearUserBookmarkIllusts,
    } = this.props;
    clearUserDetail(userId);
    clearUserIllusts(userId);
    clearUserMangas(userId);
    clearUserBookmarkIllusts(userId);
    fetchUserDetail(userId);
    fetchUserIllusts(userId);
    fetchUserMangas(userId);
    fetchUserBookmarkIllusts(userId);
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

  handleOnProfileImageLoaded = () => {
    this.setState({ viewRef: findNodeHandle(this.backgroundImage) });
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
          <Text style={styles.headerText}>
            {user.name}
          </Text>
          <Text style={styles.headerText}>
            {user.account}
          </Text>
        </View>
      </Animatable.View>
    );
  };

  renderHeaderRight = () => {
    const { userDetailItem, authUser, navigation } = this.props;
    if (!userDetailItem || !userDetailItem.user) {
      return null;
    }
    const { user } = userDetailItem;
    const shareOptions = {
      message: `${user.name} #pxview`,
      url: `http://www.pixiv.net/member.php?id=${user.id}`,
    };
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginRight: 10,
        }}
      >
        {user &&
          ((authUser && user.id !== authUser.id) || !authUser) &&
          <FollowButtonContainer
            user={user}
            buttonStyle={styles.followButton}
            textStyle={styles.followButtonText}
            navigation={navigation}
          />}
        <HeaderShareButton
          style={{ marginLeft: 10 }}
          onPress={() => Share.open(shareOptions).catch()}
        />
      </View>
    );
  };

  renderProfile = detail => {
    const { i18n } = this.props;
    const { viewRef } = this.state;
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
              ref={ref => (this.backgroundImage = ref)}
              onLoadEnd={this.handleOnProfileImageLoaded}
            />
            <BlurView
              blurType="light"
              blurAmount={20}
              overlayColor={'rgba(255, 255, 255, 0.3)'}
              viewRef={viewRef}
              style={styles.blurView}
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
              <Text>
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

  renderBookmarks = items => {
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

  renderContent = detail => {
    const {
      userIllusts,
      userMangas,
      userBookmarkIllusts,
      userIllustsItems,
      userMangasItems,
      userBookmarkIllustsItems,
    } = this.props;
    return (
      <View>
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
        {userBookmarkIllusts &&
        !userBookmarkIllusts.loading &&
        userBookmarkIllusts.items &&
        userBookmarkIllusts.items.length
          ? this.renderBookmarks(userBookmarkIllustsItems)
          : null}
      </View>
    );
  };

  render() {
    const {
      userDetail: { loaded, loading, refreshing, item },
      userDetailItem,
    } = this.props;
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
          userBookmarkIllusts,
        } = state;
        const userId = props.userId || props.navigation.state.params.userId;
        const {
          userDetailItem,
          userIllustsItems,
          userMangasItems,
          userBookmarkIllustsItems,
        } = getUserDetailPageItem(state, props);
        return {
          authUser: auth.user,
          userDetail: userDetail[userId],
          userIllusts: userIllusts[userId],
          userMangas: userMangas[userId],
          userBookmarkIllusts: userBookmarkIllusts[userId],
          userDetailItem,
          userIllustsItems,
          userMangasItems,
          userBookmarkIllustsItems,
          userId,
        };
      };
    },
    {
      ...userDetailActionCreators,
      ...userIllustsActionCreators,
      ...userMangasActionCreators,
      ...userBookmarkIllustlActionCreators,
    },
  )(UserDetail),
);
