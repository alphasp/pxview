import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView, Linking } from 'react-native';
import { connect } from 'react-redux';
import { DrawerItems, withNavigation } from 'react-navigation';
// import Icon from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import CookieManager from 'react-native-cookies';
import { connectLocalization } from './Localization';
import PXThumbnailTouchable from './PXThumbnailTouchable';
import OutlineButton from './OutlineButton';
import Separator from './Separator';
import DrawerNavigatorItem from './DrawerNavigatorItem';
import * as authActionCreators from '../common/actions/auth';
import * as browsingHistoryActionCreators
  from '../common/actions/browsingHistory';
import { globalStyles, globalStyleVariables } from '../styles';

const avatarSize = 60;
const defaultProfileImage =
  'https://source.pixiv.net/common/images/no_profile.png';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: globalStyleVariables.BACKGROUND_COLOR,
  },
  avatarContainer: {
    height: globalStyleVariables.DRAWER_WIDTH * 9 / 16,
    backgroundColor: globalStyleVariables.PRIMARY_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 16,
  },
  usernameContainer: {
    marginTop: 10,
  },
  authActionContainer: {
    flexDirection: 'row',
  },
  username: {
    color: '#fff',
  },
});

const menuList = [
  {
    id: 'works',
    title: 'myWorks',
    icon: 'picture-o',
    type: 'font-awesome',
    size: 22,
  },
  {
    id: 'connection',
    title: 'connection',
    icon: 'users',
    type: 'font-awesome',
  },
  {
    id: 'collection',
    title: 'collection',
    icon: 'heart',
    type: 'font-awesome',
  },
  {
    id: 'browsingHistory',
    title: 'browsingHistory',
    icon: 'clock-o',
    type: 'font-awesome',
  },
];

const menuList2 = [
  {
    id: 'settings',
    title: 'settings',
    icon: 'cog',
    type: 'font-awesome',
  },
  {
    id: 'feedback',
    title: 'feedback',
    icon: 'comment-o',
    type: 'font-awesome',
  },
  {
    id: 'logout',
    title: 'logout',
    icon: 'sign-out',
    type: 'font-awesome',
  },
];

class DrawerContent extends Component {
  renderProfile = () => {
    const { user, i18n } = this.props;
    return (
      <View style={styles.avatarContainer}>
        <PXThumbnailTouchable
          key={
            (user && user.profile_image_urls.px_170x170) || defaultProfileImage
          }
          uri={
            (user && user.profile_image_urls.px_170x170) || defaultProfileImage
          }
          size={avatarSize}
          style={styles.avatar}
        />
        <View style={styles.usernameContainer}>
          {user
            ? <Text style={styles.username}>{user.name}</Text>
            : <View style={styles.authActionContainer}>
                <OutlineButton
                  text={i18n.signup}
                  style={{ borderColor: '#fff' }}
                  textStyle={{ color: '#fff' }}
                  onPress={this.handleOnPressSignUp}
                />
                <OutlineButton
                  text={i18n.login}
                  style={{ marginLeft: 5, borderColor: '#fff' }}
                  textStyle={{ color: '#fff' }}
                  onPress={this.handleOnPressLogin}
                />
              </View>}
        </View>
      </View>
    );
  };

  navigateWithDebounce = (routeName, options) => {
    const { navigation: { navigate } } = this.props;
    setTimeout(() => navigate(routeName, options, 0));
  };

  handleOnDrawerItemPress = (item, focused) => {
    const { user, navigation: { navigate } } = this.props;
    // todo add myPage custom menus DrawerNavigatorItems
    navigate('DrawerClose');
    if (!focused) {
      switch (item.id) {
        case 'works':
          if (!user) {
            this.handleOnPressLogin(authUser =>
              navigate('MyWorks', { userId: authUser.id }),
            );
          } else {
            this.navigateWithDebounce('MyWorks', { userId: user.id });
          }
          break;
        case 'collection':
          if (!user) {
            this.handleOnPressLogin(authUser =>
              navigate('MyCollection', { userId: authUser.id }),
            );
          } else {
            this.navigateWithDebounce('MyCollection', { userId: user.id });
          }
          break;
        case 'connection':
          if (!user) {
            this.handleOnPressLogin(authUser =>
              navigate('MyConnection', { userId: authUser.id }),
            );
          } else {
            this.navigateWithDebounce('MyConnection', { userId: user.id });
          }
          break;
        case 'browsingHistory':
          this.navigateWithDebounce('BrowsingHistory');
          break;
        case 'settings': {
          this.navigateWithDebounce('Settings');
          break;
        }
        case 'feedback': {
          this.navigateWithDebounce('Feedback');
          break;
        }
        case 'logout': {
          const { clearBrowsingHistory, logout } = this.props;
          logout();
          clearBrowsingHistory();
          // clear cookies set from webview for account settings
          CookieManager.clearAll(() => {});
          break;
        }
        default:
          break;
      }
    }
  };

  handleOnPressSignUp = () => {
    const { navigation: { navigate } } = this.props;
    navigate('DrawerClose');
    const url = 'https://accounts.pixiv.net/signup';
    Linking.canOpenURL(url)
      .then(supported => {
        if (!supported) {
          console.log(`Can't handle url: ${url}`);
          return null;
        }
        return Linking.openURL(url);
      })
      .catch(err => console.error('An error occurred', err));
  };

  navigateToLogin = onLoginSuccess => {
    const { navigate } = this.props.navigation;
    navigate('DrawerClose');
    this.navigateWithDebounce('Login', {
      onLoginSuccess,
    });
  };

  handleOnPressLogin = () => {
    this.navigateToLogin();
  };

  renderList = list => {
    const { user, i18n } = this.props;
    if (!user && list.some(l => l.id === 'logout')) {
      list = list.filter(l => l.id !== 'logout');
    }
    return (
      <View>
        {list.map(item => (
          <DrawerNavigatorItem
            key={item.id}
            label={i18n[item.title]}
            icon={<Icon name={item.icon} size={item.size || 24} />}
            onPress={() => this.handleOnDrawerItemPress(item)}
          />
        ))}
      </View>
    );
  };

  render() {
    return (
      <View style={globalStyles.container}>
        <ScrollView>
          {this.renderProfile()}
          <DrawerItems {...this.props} />
          <Separator noPadding />
          {this.renderList(menuList)}
          <Separator noPadding />
          {this.renderList(menuList2)}
        </ScrollView>
      </View>
    );
  }
}

export default connectLocalization(
  withNavigation(
    connect(
      state => ({
        user: state.auth.user,
      }),
      {
        ...authActionCreators,
        ...browsingHistoryActionCreators,
      },
    )(DrawerContent),
  ),
);
