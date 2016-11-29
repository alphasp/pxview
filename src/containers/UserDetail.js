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
} from 'react-native';
import { connect } from 'react-redux';
import { Actions, ActionConst } from 'react-native-router-flux';
import HtmlView from 'react-native-htmlview';
import Hyperlink from 'react-native-hyperlink';
import Icon from 'react-native-vector-icons/FontAwesome';
import truncate from 'lodash.truncate';
import * as Animatable from 'react-native-animatable';
import IllustCollection from '../components/IllustCollection';
import PXThumbnail from '../components/PXThumbnail';
import PXThumbnailTouchable from '../components/PXThumbnailTouchable';
import Loader from '../components/Loader';
import { fetchUserDetail, clearUserDetail } from '../common/actions/userDetail';
import { fetchUserIllusts, clearUserIllusts } from '../common/actions/userIllust';
import { fetchUserMangas, clearUserMangas } from '../common/actions/userManga';
import { fetchUserBookmarkIllusts, clearUserBookmarkIllusts } from '../common/actions/userBookmarkIllust';

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
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      isShowTitle: false,
    }
  }
  
  componentDidMount() {
    const { dispatch, userId } = this.props;
    dispatch(clearUserDetail(userId));
    dispatch(clearUserIllusts(userId));
    dispatch(clearUserMangas(userId));
    dispatch(clearUserBookmarkIllusts(userId));

    dispatch(fetchUserDetail(userId)).then(() => {
      const { userDetail, userId } = this.props;
      if (userDetail[userId] && userDetail[userId].item) {
        const user = userDetail[userId].item.user;
        Actions.refresh({ 
          renderTitle: () => {
            return (
              <Animatable.View style={styles.navbarHeader}>
                <View style={styles.thumnailNameContainer}>
                  <PXThumbnail uri={user.profile_image_urls.medium} />
                  <View style={styles.nameContainer}>
                    <Text>{user.name}</Text>
                    <Text>{user.account}</Text>
                  </View>
                </View>
              </Animatable.View>
            )
          } 
        });
      }
    });
    dispatch(fetchUserIllusts(userId));
    dispatch(fetchUserMangas(userId));
    dispatch(fetchUserBookmarkIllusts(userId));
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
    const { dispatch, userId } = this.props;
    this.setState({
      refereshing: true
    });
    dispatch(clearUserDetail(userId));
    dispatch(clearUserIllusts(userId));
    dispatch(clearUserMangas(userId));
    dispatch(clearUserBookmarkIllusts(userId));

    dispatch(fetchUserIllusts(userId));
    dispatch(fetchUserMangas(userId));
    dispatch(fetchUserBookmarkIllusts(userId));
    dispatch(fetchUserDetail(userId)).finally(() => {
      this.setState({
        refereshing: false
      }); 
    })
  }
  handleOnScroll = ({ nativeEvent }) => {
    const { userDetail, userId } = this.props;
    const { isShowTitle } = this.state;
    if (userDetail[userId] && userDetail[userId].item) {
      const user = userDetail[userId].item.user;
      if (nativeEvent.contentOffset.y >= 135) {
        if (!isShowTitle) {
          this.setState({
            isShowTitle: true
          });
          Actions.refresh({ 
            renderTitle: () => {
              return (
                <Animatable.View style={[styles.navbarHeader, {
                  opacity: 1,
                }]}>
                  <View style={styles.thumnailNameContainer}>
                    <PXThumbnail uri={user.profile_image_urls.medium} />
                    <View style={styles.nameContainer}>
                      <Text>{user.name}</Text>
                      <Text>{user.account}</Text>
                    </View>
                  </View>
                </Animatable.View>
              )
            } 
          });
        }
      }
      else {
        if (isShowTitle) {
          this.setState({
            isShowTitle: false
          });
          Actions.refresh({ 
            renderTitle: () => {
              return (
                <Animatable.View style={[styles.navbarHeader, {
                  opacity: 0,
                }]}>
                  <View style={styles.thumnailNameContainer}>
                    <PXThumbnail uri={user.profile_image_urls.medium} />
                    <View style={styles.nameContainer}>
                      <Text>{user.name}</Text>
                      <Text>{user.account}</Text>
                    </View>
                  </View>
                </Animatable.View>
              )
            } 
          });
        }
      }
    }
  }

  renderProfile = (detail) => {
    console.log('detail ', detail)
    return (
      <View>
        <View style={styles.coverOuterContainer}>
          <View style={styles.coverInnerContainer}>
            <View style={styles.cover}>
            </View>
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
    const { userId } = this.props;
    return (
      <IllustCollection 
        title="Illust Works"
        viewAllTitle={`${profile.total_illusts} Works`}  
        items={data.items}
        maxItems={6}
        onPressViewMore={() => Actions.userIllust({ userId })}
      />
    )
  }

  renderMangaCollection = (data, profile) => {
    const { userId } = this.props;
    return (
      <IllustCollection 
        title="Manga Works"
        viewAllTitle={`${profile.total_manga} Works`}
        items={data.items}
        maxItems={6}
        onPressViewMore={() => Actions.userManga({ userId })}
      />
    )
  }

  renderBookmarks = (data) => {
    const { userId } = this.props;
    return (
      <IllustCollection 
        title="Illust/Manga Collection"
        viewAllTitle="All"
        items={data.items}
        maxItems={6}
        onPressViewMore={() => Actions.userBookmarkIllust({ userId })}
      />
    )
  }

  renderContent = (detail) => {
    const { userIllust, userManga, userBookmarkIllust, userId } = this.props;
    return (
      <View>
        {
          this.renderProfile(detail)
        }
        {
          (userIllust[userId] && !userIllust[userId].loading && userIllust[userId].items && userIllust[userId].items.length) ?
          this.renderIllustCollection(userIllust[userId], detail.profile)
          :
          null
        }
        {
          (userManga[userId] && !userManga[userId].loading && userManga[userId].items.length) ?
          this.renderMangaCollection(userManga[userId], detail.profile)
          :
          null
        }
        {
          (userBookmarkIllust[userId] && !userBookmarkIllust[userId].loading && userBookmarkIllust[userId].items && userBookmarkIllust[userId].items.length) ?
          this.renderBookmarks(userBookmarkIllust[userId])
          :
          null
        }
      </View>
    )
  }

  render() {
    //user illusts
    //bookmark illusts
    const { userDetail, userId } = this.props;
    const { refreshing } = this.state;
    return (
      <View style={styles.container}>
        {
          (userDetail[userId] && !userDetail[userId].loading) ?
          <ScrollView 
            style={styles.container} 
            onScroll={this.handleOnScroll}
            scrollEventThrottle={100}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={this.handleOnRefresh}
              />
            }
          >
            {
              this.renderContent(userDetail[userId].item)
            }
          </ScrollView>
          :
          <Loader />
        }
      </View>
    );
  }
}

export default connect(state => {
  return {
    userDetail: state.userDetail,
    userIllust: state.userIllust,
    userManga: state.userManga,
    userBookmarkIllust: state.userBookmarkIllust,
  }
})(UserDetail);