import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
  Linking,
  RefreshControl,
  Platform,
  findNodeHandle,
  InteractionManager,
} from 'react-native';
import { connect } from 'react-redux';
import { denormalize } from 'normalizr';
import HtmlView from 'react-native-htmlview';
import Hyperlink from 'react-native-hyperlink';
import Icon from 'react-native-vector-icons/FontAwesome';
import truncate from 'lodash.truncate';
import * as Animatable from 'react-native-animatable';
import { BlurView } from 'react-native-blur';
import IllustCollection from '../components/IllustCollection';
import PXThumbnail from '../components/PXThumbnail';
import PXThumbnailTouchable from '../components/PXThumbnailTouchable';
import PXImage from '../components/PXImage';
import PXBlurView from '../components/PXBlurView';
import Loader from '../components/Loader';
import * as userDetailActionCreators from '../common/actions/userDetail';
import * as userIllustsActionCreators from '../common/actions/userIllusts';
import * as userMangasActionCreators from '../common/actions/userMangas';
import * as userBookmarkIllustlActionCreators from '../common/actions/userBookmarkIllusts';
import { denormalizedData } from '../common/helpers/normalizrHelper';
import Schemas from '../common/constants/schemas';

const avatarSize = 70;
const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#E9EBEE',
  },
  coverOuterContainer: {
    //backgroundColor: '#5cafec',
    height: 150,
  },
  coverInnerContainer: {
    //backgroundColor: '#5cafec',
    height: 100,
  },
  cover: {
    backgroundColor: '#5cafec',
    //height: 100,
    flex: 1,
    //flexDirection: 'row',
  },
  avatarContainer: {
    position: 'absolute',
    // backgroundColor: 'rgba(0, 0, 0, 0.3)',
    //top: 0,
    //left: 10,
    //right: 0,
    bottom: -(avatarSize / 2),
    //flex: 1,
    width: windowWidth,
    alignItems: 'center',
    //paddingBottom: 40
  },
  profileContainer: {
    flex: 1, 
    alignItems: 'center'
  },
  userName: {
    fontSize: 20
  },
  statType: {
    color: '#90949c'
  },
  row: {
    flexDirection: 'row'
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
    color: '#2980b9'
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
        top: 15
      },
    }),
    alignItems: 'center',
    opacity: 0,
  },
  thumnailNameContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  nameContainer: {
    flexDirection: 'column',
    marginLeft: 10
  },
});

class UserDetail extends Component {
  static navigationOptions = {
    header: ({ state, setParams, goBack } , defaultHeader) => {
      const { isShowTitle, isScrolled, user } = state.params;
      const title = (user && isScrolled) ? (
        <Animatable.View 
          style={styles.thumnailNameContainer} 
          animation={isShowTitle ? "fadeIn" : "fadeOut"}
          duration={300}
        >
          <PXThumbnailTouchable uri={user.profile_image_urls.medium} />
          <View style={styles.nameContainer}>
            <Text>{user.name}</Text>
            <Text>{user.account}</Text>
          </View>
        </Animatable.View>
      ) : null;
      return {
        ...defaultHeader,
        title,
      }
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      viewRef: 0,
    }
  }

  componentDidMount() {
    const { 
      userId, userDetail,
      navigation: { setParams },
      fetchUserDetail,  clearUserDetail,
      fetchUserIllusts, clearUserIllusts,
      fetchUserMangas,  clearUserMangas,
      fetchUserBookmarkIllusts, clearUserBookmarkIllusts
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
      else {
        setParams({ user: userDetail.item.user });
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    const { userDetail: prevUserDetail } = this.props;
    const { userDetail, userId, navigation: { setParams } } = nextProps;
    if (userDetail && userDetail.item && !prevUserDetail.item) {
      const { dataSource } = this.state;
      setParams({ user: userDetail.item.user });
    }
  }

  handleOnLinkPress = (url) => {
    console.log('clicked link: ', url)
    Linking.canOpenURL(url).then(supported => {
      if (!supported) {
        console.log('Can\'t handle url: ' + url);
      } else {
        return Linking.openURL(url);
      }
    }).catch(err => {
      console.error('Error on link press ', err)
    });
  }

  handleOnRefresh = () => {
    const { 
      userId, 
      fetchUserDetail,  clearUserDetail,
      fetchUserIllusts, clearUserIllusts,
      fetchUserMangas,  clearUserMangas,
      fetchUserBookmarkIllusts, clearUserBookmarkIllusts
    } = this.props;
    clearUserDetail(userId);
    clearUserIllusts(userId);
    clearUserMangas(userId);
    clearUserBookmarkIllusts(userId);
    fetchUserDetail(userId);
    fetchUserIllusts(userId);
    fetchUserMangas(userId);
    fetchUserBookmarkIllusts(userId);
  }

  handleOnScroll = ({ nativeEvent }) => {
    const { userDetail, userId, navigation: { setParams, state: { params: { isShowTitle, isScrolled } } } } = this.props;
    if (!isScrolled) {
      setParams({ isScrolled: true });
    }
    if (userDetail && userDetail.item) {
      if (nativeEvent.contentOffset.y >= 135) {
        if (!isShowTitle) {
          setParams({ isShowTitle: true });
        }
      }
      else {
        if (isShowTitle) {
          setParams({ isShowTitle: false });
        }
      }
    }
  }

  handleOnFoundImageSize = () => {
    this.setState({ viewRef: findNodeHandle(this.refs.backgroundImage) });
  }

  renderProfile = (detail) => {
    const { viewRef } = this.state;
    return (
      <View>
        <View style={styles.coverOuterContainer}>
          <View style={styles.coverInnerContainer}>
            <PXImage
              uri={detail.user.profile_image_urls.medium}
              style={{
                resizeMode: "cover",
                width: windowWidth,
                height: 100,
                backgroundColor: 'transparent',
              }}
              ref="backgroundImage"
              onFoundImageSize={this.handleOnFoundImageSize}
            >
              <BlurView 
                blurType="light" 
                blurAmount={20}
                blurRadius={15}
                downsampleFactor={10}
                overlayColor={'rgba(255, 255, 255, 0.3)'}
                viewRef={viewRef}
                style={{
                  position:'absolute', left:0, right:0, top:0, bottom:0
                }}
              >
                <View style={{
                  width: windowWidth,
                  height: 100,
                }}
                />
              </BlurView>
            </PXImage>
            <View style={styles.avatarContainer}>
              <PXThumbnail
                uri={detail.user.profile_image_urls.medium}
                size={avatarSize}
              />
            </View>
          </View>
        </View>
        <View style={styles.profileContainer}>
          <Text style={styles.userName}>{detail.user.name}</Text>
          <View style={{flexDirection: 'row'}}>
            {
              detail.profile.webpage ?
              <View style={styles.row}>
                <Icon name="home" style={styles.icon} />
                <Hyperlink 
                  linkStyle={styles.externalLink}
                  linkText={truncate(detail.profile.webpage.replace(/https?:\/\//i, ""), { length: 15 })}
                  onPress={url => this.handleOnLinkPress(url)}
                >
                  <Text style={styles.stat}>{detail.profile.webpage}</Text>
                </Hyperlink>
              </View>
              :
              null
            }
            {
              detail.profile.twitter_account ?
              <View style={styles.row}>
                <Icon name="twitter" style={styles.icon} />
                <Hyperlink 
                  linkStyle={styles.externalLink}
                  linkText={detail.profile.twitter_account}
                  onPress={url => this.handleOnLinkPress(url)}
                >
                  <Text style={styles.stat}>{detail.profile.twitter_url}</Text>
                </Hyperlink>
              </View>
              :
              null
            }
          </View>
          <View style={styles.row}>
            <View style={styles.row}>
              <Text>{detail.profile.total_follow_users}</Text>
              <Text style={styles.statType}> Following </Text>
            </View>
            <View style={styles.row}>
              <Text>{detail.profile.total_follower}</Text>
              <Text style={styles.statType}> Followers </Text>
            </View>
            <View style={styles.row}>
              <Text>{detail.profile.total_mypixiv_users}</Text>
              <Text style={styles.statType}> My Pixiv </Text>
            </View>
          </View>
        </View>
        <View style={styles.infoContainer}>
          <View style={styles.commentContainer}>
            <Hyperlink 
              linkStyle={styles.hyperlink}
              onPress={url => this.handleOnLinkPress(url)}
            >
              <Text>{detail.user.comment}</Text>
            </Hyperlink>
          </View>
        </View>
      </View>
    )
  }

  renderIllustCollection = (data, profile) => {
    const { userId, navigation } = this.props;
    return (
      <IllustCollection 
        title="Illust Works"
        total={profile.total_illusts}
        viewMoreTitle="Works"  
        items={data.items}
        maxItems={6}
        onPressViewMore={() => navigation.navigate('UserIllusts', { userId })}
        navigation={navigation}
      />
    )
  }

  renderMangaCollection = (data, profile) => {
    const { userId, navigation } = this.props;
    return (
      <IllustCollection 
        title="Manga Works"
        total={profile.total_manga}
        viewMoreTitle="Works"
        items={data.items}
        maxItems={6}
        onPressViewMore={() => navigation.navigate('UserMangas', { userId })}
        navigation={navigation}
      />
    )
  }

  renderBookmarks = (data) => {
    const { userId, navigation } = this.props;
    return (
      <IllustCollection 
        title="Illust/Manga Collection"
        viewMoreTitle="All"
        items={data.items}
        maxItems={6}
        onPressViewMore={() => navigation.navigate('UserBookmarkIllusts', { userId })}
        navigation={navigation}
      />
    )
  }

  renderContent = (detail) => {
    const { userIllusts, userMangas, userBookmarkIllusts, userId } = this.props;
    return (
      <View>
        {
          this.renderProfile(detail)
        }
        {
          (userIllusts && !userIllusts.loading && userIllusts.items && userIllusts.items.length) ?
          this.renderIllustCollection(userIllusts, detail.profile)
          :
          null
        }
        {
          (userMangas && !userMangas.loading && userMangas.items && userMangas.items.length) ?
          this.renderMangaCollection(userMangas, detail.profile)
          :
          null
        }
        {
          (userBookmarkIllusts && !userBookmarkIllusts.loading && userBookmarkIllusts.items && userBookmarkIllusts.items.length) ?
          this.renderBookmarks(userBookmarkIllusts)
          :
          null
        }
      </View>
    )
  }

  render() {
    const { userDetail: { loaded, loading, item, refreshing }, userId } = this.props;
    return (
      <View style={styles.container}>
        {
          (!item || (!loaded && loading)) &&
          <Loader />
        }
        {
          item ?
          <ScrollView 
            style={styles.container} 
            onScroll={this.handleOnScroll}
            scrollEventThrottle={16}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={this.handleOnRefresh}
              />
            }
          >
            {
              this.renderContent(item)
            }
          </ScrollView>
          :
          null
        }
      </View>
    );
  }
}

export default connect((state, props) => {
  const { entities, userDetail, userIllusts, userMangas, userBookmarkIllusts } = state;
  const userId = props.userId || props.navigation.state.params.userId;
  return {
    userDetail: denormalizedData(userDetail[userId], 'item', Schemas.USER_PROFILE, entities),
    userIllusts: denormalizedData(userIllusts[userId], 'items', Schemas.ILLUST_ARRAY, entities),
    userMangas: denormalizedData(userMangas[userId], 'items', Schemas.ILLUST_ARRAY, entities),
    userBookmarkIllusts: denormalizedData(userBookmarkIllusts[userId], 'items', Schemas.ILLUST_ARRAY, entities),
    userId
  }
}, {
  ...userDetailActionCreators,
  ...userIllustsActionCreators,
  ...userMangasActionCreators,
  ...userBookmarkIllustlActionCreators
})(UserDetail);