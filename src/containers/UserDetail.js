import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
  Linking,
} from 'react-native';
import { connect } from 'react-redux';
import { Actions, ActionConst } from 'react-native-router-flux';
import HtmlView from 'react-native-htmlview';
import Hyperlink from 'react-native-hyperlink';
import Icon from 'react-native-vector-icons/FontAwesome';
import truncate from 'lodash.truncate';
import PXThumbnail from '../components/PXThumbnail';
import Loader from '../components/Loader';
import { fetchUserDetail, clearUserDetail } from '../common/actions/userDetail';

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
});

class UserDetail extends Component {
  constructor(props) {
    super(props);
  }
  
  componentDidMount() {
    const { dispatch, userId } = this.props;
    dispatch(fetchUserDetail(userId));
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

  renderContent(detail) {
    console.log('detail ', detail)
    return (
      <ScrollView alwaysBounceVertical={false}>
        <View style={styles.coverOuterContainer}>
          <View style={styles.coverInnerContainer}>
            <View style={styles.cover}>
            </View>
            <View style={styles.avatarContainer}>
              <PXThumbnail
                uri={detail.user.profile_image_urls.medium}
                size={avatarSize}
                style={{
                  borderColor: '#E9EBEE',
                  borderWidth: 1,
                }}
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
      </ScrollView>
    )
  }

  render() {
    //user illusts
    //bookmark illusts
    const { userDetail, userId } = this.props;
    return (
      <View style={styles.container}>
        {
          (userDetail[userId] && !userDetail[userId].loading) ?
          this.renderContent(userDetail[userId].item)
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
  }
})(UserDetail);