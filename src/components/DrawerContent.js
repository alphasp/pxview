import React, { Component } from 'react';
import { View, ScrollView, Linking } from 'react-native';
import { connect } from 'react-redux';
import { DrawerItems, withNavigation } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import CookieManager from 'react-native-cookies';
import { connectLocalization } from './Localization';
import UserCover from './UserCover';
import Separator from './Separator';
import DrawerNavigatorItem from './DrawerNavigatorItem';
import * as authActionCreators from '../common/actions/auth';
import * as browsingHistoryActionCreators
  from '../common/actions/browsingHistory';
import { globalStyles } from '../styles';
import { SCREENS } from '../common/constants';

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
  renderCover = () => {
    const { user, i18n } = this.props;
    return (
      <UserCover
        user={user}
        i18n={i18n}
        onPressAvatar={this.handleOnPressAvatar}
        onPressLogin={this.handleOnPressLogin}
        onPressSignUp={this.handleOnPressSignUp}
      />
    );
  };

  navigateWithDebounce = (routeName, options) => {
    const { navigation: { navigate } } = this.props;
    setTimeout(() => navigate(routeName, options, 0));
  };

  handleOnDrawerItemPress = (item, focused) => {
    const { user, navigation: { navigate } } = this.props;
    navigate('DrawerClose');
    if (!focused) {
      switch (item.id) {
        case 'works':
          if (!user) {
            this.handleOnPressLogin(authUser =>
              navigate(SCREENS.MyWorks, { userId: authUser.id }),
            );
          } else {
            this.navigateWithDebounce(SCREENS.MyWorks, { userId: user.id });
          }
          break;
        case 'collection':
          if (!user) {
            this.handleOnPressLogin(authUser =>
              navigate(SCREENS.MyCollection, { userId: authUser.id }),
            );
          } else {
            this.navigateWithDebounce(SCREENS.MyCollection, {
              userId: user.id,
            });
          }
          break;
        case 'connection':
          if (!user) {
            this.handleOnPressLogin(authUser =>
              navigate(SCREENS.MyConnection, { userId: authUser.id }),
            );
          } else {
            this.navigateWithDebounce(SCREENS.MyConnection, {
              userId: user.id,
            });
          }
          break;
        case 'browsingHistory':
          this.navigateWithDebounce(SCREENS.BrowsingHistory);
          break;
        case 'settings': {
          this.navigateWithDebounce(SCREENS.Settings);
          break;
        }
        case 'feedback': {
          this.navigateWithDebounce(SCREENS.Feedback);
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
    this.navigateWithDebounce(SCREENS.Login, {
      onLoginSuccess,
    });
  };

  handleOnPressLogin = () => {
    this.navigateToLogin();
  };

  handleOnPressAvatar = () => {
    const { user, navigation: { navigate } } = this.props;
    navigate('DrawerClose');
    this.navigateWithDebounce(SCREENS.UserDetail, {
      userId: user.id,
    });
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
          {this.renderCover()}
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
