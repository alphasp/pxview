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
} from 'react-native';
import { connect } from 'react-redux';
import { Actions, ActionConst } from 'react-native-router-flux';
import { List, ListItem } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Animatable from 'react-native-animatable';
import { BlurView } from 'react-native-blur';
import IllustCollection from '../components/IllustCollection';
import PXThumbnail from '../components/PXThumbnail';
import PXThumbnailTouchable from '../components/PXThumbnailTouchable';
import PXImage from '../components/PXImage';
import PXBlurView from '../components/PXBlurView';
import PXTouchable from '../components/PXTouchable';
import Loader from '../components/Loader';
import OutlineButton from '../components/OutlineButton';
import { logout } from '../common/actions/auth';

const avatarSize = 70;
const windowWidth = Dimensions.get('window').width;
const defaultProfileImage = 'https://source.pixiv.net/common/images/no_profile.png';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#E9EBEE',
  },
  coverContainer: {
    //backgroundColor: '#5cafec',
    height: 150,
  },
  coverInnerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: '#5cafec',
    // flex: 1,
  },
  profileImage: {
    resizeMode: "cover",
    width: windowWidth,
    height: 150,
    backgroundColor: 'transparent',
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
  authActionContainer: {
    //width: 200,
    flexDirection: 'row',
    //justifyContent: 'space-between',
    marginTop: 10,
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

const menuList = [
  {
    id: 'works', 
    title: 'Submitted Works',
    icon: 'picture-o',
    type: 'font-awesome',
  },
  {
    id: 'connection',
    title: 'My Connection',
    icon: 'users',
    type: 'font-awesome',
  },
  {
    id: 'collection',
    title: 'Collection',
    icon: 'heart',
    type: 'font-awesome',
  },
  {
    id: 'history',
    title: 'Browsing History',
    icon: 'clock-o',
    type: 'font-awesome',
  },
];

const menuList2 = [
  {
    id: 'settings',
    title: 'Settings',
    icon: 'cog',
    type: 'font-awesome'
  },
  {
    id: 'feedback',
    title: 'Feedback',
    icon: 'comment-o',
    type: 'font-awesome'
  }, 
  {
    id: 'logout',
    title: 'Logout',
    icon: 'sign-out',
    type: 'font-awesome',
  }
];

class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      isShowTitle: false,
      viewRef: 0,
    }
  }
  
  componentDidMount() {
    const { dispatch, userId } = this.props;
    // dispatch(clearUserDetail(userId));
    // dispatch(fetchUserDetail(userId)).then(() => {
    //   const { userDetail, userId } = this.props;
    //   if (userDetail[userId] && userDetail[userId].item) {
    //     const user = userDetail[userId].item.user;
    //     Actions.refresh({ 
    //       renderTitle: () => {
    //         return (
    //           <Animatable.View style={styles.navbarHeader}>
    //             <View style={styles.thumnailNameContainer}>
    //               <PXThumbnail uri={user.profile_image_urls.medium} />
    //               <View style={styles.nameContainer}>
    //                 <Text>{user.name}</Text>
    //                 <Text>{user.account}</Text>
    //               </View>
    //             </View>
    //           </Animatable.View>
    //         )
    //       } 
    //     });
    //   }
    // });
  }

  handleOnAvatarImageLoaded = () => {
    this.setState({ viewRef: findNodeHandle(this.refs.backgroundImage) });
  }

  handleOnPressListItem = (item) => {
    const { dispatch, user } = this.props;
    console.log('on press ', item);
    switch (item.id) {
      case 'collection':
        //require user login
        Actions.myCollection({ userId: user.id});
        break;
      case 'logout':
        dispatch(logout());
        break;
    }
  }

  handleOnPressSignUp = () => {
    const url = 'https://accounts.pixiv.net/signup';
    Linking.canOpenURL(url).then(supported => {
      if (!supported) {
        console.log('Can\'t handle url: ' + url);
      } 
      else {
        return Linking.openURL(url);
      }
    }).catch(err => console.error('An error occurred', err));
  }

  handleOnPressLogin = () => {
    Actions.login();
  }

  renderProfile = (user) => {
    // <View style={styles.cover}>
    //         </View>
    const { viewRef } = this.state;
    return (
      <View style={styles.coverContainer}>
        <PXImage
          key={(user && user.profile_image_urls.px_170x170) || defaultProfileImage}
          uri={(user && user.profile_image_urls.px_170x170) || defaultProfileImage}
          style={{
            resizeMode: "cover",
            width: windowWidth,
            height: 150,
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
            <View style={{ width: windowWidth, height: 150 }} />
          </BlurView>
          <View style={styles.coverInnerContainer}>
            <PXThumbnailTouchable
              key={user && user.profile_image_urls.px_170x170 || defaultProfileImage}
              uri={user && user.profile_image_urls.px_170x170 || defaultProfileImage}
              size={avatarSize}
            />
            {
              user ?
              <Text>{user.name}</Text>
              :
              <View style={styles.authActionContainer}>
                <OutlineButton 
                  text="Sign Up"
                  onPress={this.handleOnPressSignUp} 
                />
                <OutlineButton 
                  text="Login" 
                  style={{marginLeft: 5}} 
                  onPress={this.handleOnPressLogin}
                />
              </View>
            }
          </View>
        </PXImage>
      </View>
    )
  }

  renderList = (list) => {
    return (
      <List>
        {
          list.map((item, i) => (
            <ListItem
              key={i}
              title={item.title}
              leftIcon={{name: item.icon, type: item.type, style: {width: 30, textAlign: 'center'}}}
              onPress={() => this.handleOnPressListItem(item)}
            />
          ))
        }
      </List>
    );
  }

  render() {
    //user illusts
    //bookmark illusts
    //const { userDetail, userId } = this.props;
    const { user } = this.props;
    console.log("user ", user)
    
    return (
      <View style={styles.container}>
        {
          <ScrollView 
            style={styles.container} 
          >
            {this.renderProfile(user)}
            {this.renderList(menuList)}
            {this.renderList(menuList2)}
          </ScrollView>
        }
      </View>
    );
  }
}

export default connect(state => {
  return {
    user: state.auth.user,
  }
})(UserProfile);