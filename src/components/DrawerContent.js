import React, { Component } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { connect } from 'react-redux';
import { DrawerItems, DrawerActions, withNavigation } from 'react-navigation';
import { withTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
// import CookieManager from 'react-native-cookies';
import { connectLocalization } from './Localization';
import UserCover from './UserCover';
import Separator from './Separator';
import DrawerNavigatorItem from './DrawerNavigatorItem';
import * as authActionCreators from '../common/actions/auth';
import * as browsingHistoryIllustsActionCreators from '../common/actions/browsingHistoryIllusts';
import * as browsingHistoryNovelsActionCreators from '../common/actions/browsingHistoryNovels';
import * as searchHistoryActionCreators from '../common/actions/searchHistory';
import * as themeActionCreators from '../common/actions/theme';
import { globalStyles } from '../styles';
import { SCREENS, THEME_TYPES } from '../common/constants';

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
    const { user, i18n, themeName } = this.props;
    return (
      <UserCover
        user={user}
        i18n={i18n}
        themeName={themeName}
        onPressAvatar={this.handleOnPressAvatar}
        onPressChangeTheme={this.handleOnPressChangeTheme}
      />
    );
  };

  handleOnDrawerItemPress = (item, focused) => {
    const { user, navigation: { navigate, dispatch } } = this.props;
    // navigation.closeDrawer();
    dispatch(DrawerActions.closeDrawer());
    if (!focused) {
      switch (item.id) {
        case 'works':
          navigate(SCREENS.MyWorks, { userId: user.id });
          break;
        case 'collection':
          navigate(SCREENS.MyCollection, {
            userId: user.id,
          });
          break;
        case 'connection':
          navigate(SCREENS.MyConnection, {
            userId: user.id,
          });
          break;
        case 'browsingHistory':
          navigate(SCREENS.BrowsingHistory);
          break;
        case 'settings': {
          navigate(SCREENS.Settings);
          break;
        }
        case 'feedback': {
          navigate(SCREENS.Feedback);
          break;
        }
        case 'logout': {
          this.handleOnPressLogout();
          break;
        }
        default:
          break;
      }
    }
  };

  handleOnPressLogout = () => {
    const { user, i18n } = this.props;
    if (user.isProvisionalAccount) {
      Alert.alert(
        i18n.logoutConfirmNoRegisterTitle,
        i18n.logoutConfirmNoRegisterDescription,
        [
          { text: i18n.cancel, style: 'cancel' },
          {
            text: i18n.commentRequireAccountRegistrationAction,
            onPress: this.handleOnPressRegisterAccount,
          },
          {
            text: i18n.logout,
            style: 'destructive',
            onPress: this.handleOnPressConfirmLogout,
          },
        ],
        { cancelable: false },
      );
    } else {
      Alert.alert(
        i18n.logoutConfirm,
        null,
        [
          { text: i18n.cancel, style: 'cancel' },
          {
            text: i18n.logout,
            style: 'destructive',
            onPress: this.handleOnPressConfirmLogout,
          },
        ],
        { cancelable: false },
      );
    }
  };

  handleOnPressConfirmLogout = () => {
    const {
      clearBrowsingHistoryIllusts,
      clearBrowsingHistoryNovels,
      clearSearchHistory,
      logout,
    } = this.props;
    logout();
    clearBrowsingHistoryIllusts();
    clearBrowsingHistoryNovels();
    clearSearchHistory();
    // clear cookies set from webview for advance account settings
    // CookieManager.clearAll();
  };

  handleOnPressAvatar = () => {
    const { user, navigation: { navigate, dispatch } } = this.props;
    // navigation.closeDrawer();
    dispatch(DrawerActions.closeDrawer());
    navigate(SCREENS.UserDetail, {
      userId: user.id,
    });
  };

  handleOnPressChangeTheme = () => {
    const { themeName, setTheme, navigation: { navigate } } = this.props;
    if (themeName === THEME_TYPES.DARK) {
      setTheme(THEME_TYPES.LIGHT);
    } else {
      setTheme(THEME_TYPES.DARK);
    }
    navigate('DrawerClose');
  };

  renderList = list => {
    const { user, i18n } = this.props;
    if (!user && list.some(l => l.id === 'logout')) {
      list = list.filter(l => l.id !== 'logout');
    }
    return (
      <View>
        {list.map(item =>
          <DrawerNavigatorItem
            key={item.id}
            label={i18n[item.title]}
            icon={<Icon name={item.icon} size={item.size || 24} />}
            onPress={() => this.handleOnDrawerItemPress(item)}
          />,
        )}
      </View>
    );
  };

  render() {
    const { theme } = this.props;
    return (
      <View
        style={[
          globalStyles.container,
          { backgroundColor: theme.colors.surface },
        ]}
      >
        <ScrollView>
          {this.renderCover()}
          <DrawerItems
            {...this.props}
            inactiveTintColor={theme.colors.text}
            activeBackgroundColor="#D3D3D3"
            activeTintColor={theme.colors.activeTint}
          />
          <Separator noPadding />
          {this.renderList(menuList)}
          <Separator noPadding />
          {this.renderList(menuList2)}
        </ScrollView>
      </View>
    );
  }
}

export default withTheme(
  connectLocalization(
    withNavigation(
      connect(
        state => ({
          user: state.auth.user,
          themeName: state.theme.name,
        }),
        {
          ...authActionCreators,
          ...browsingHistoryIllustsActionCreators,
          ...browsingHistoryNovelsActionCreators,
          ...searchHistoryActionCreators,
          ...themeActionCreators,
        },
      )(DrawerContent),
    ),
  ),
);
