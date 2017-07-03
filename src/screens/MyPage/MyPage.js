import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Linking } from 'react-native';
import { connect } from 'react-redux';
import { List, ListItem } from 'react-native-elements';
import CookieManager from 'react-native-cookies';
import { connectLocalization } from '../../components/Localization';
import UserCover from '../../components/UserCover';
import * as authActionCreators from '../../common/actions/auth';
import * as browsingHistoryActionCreators
  from '../../common/actions/browsingHistory';
import { globalStyleVariables } from '../../styles';
import { SCREENS } from '../../common/constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: globalStyleVariables.BACKGROUND_COLOR,
  },
});

const menuList = [
  {
    id: 'works',
    title: 'myWorks',
    icon: 'picture-o',
    type: 'font-awesome',
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

class MyPage extends Component {
  handleOnPressListItem = item => {
    const { user, navigation: { navigate } } = this.props;
    switch (item.id) {
      case 'works':
        if (!user) {
          this.navigateToLogin(authUser =>
            navigate(SCREENS.MyWorks, { userId: authUser.id }),
          );
        } else {
          navigate(SCREENS.MyWorks, { userId: user.id });
        }
        break;
      case 'collection':
        if (!user) {
          this.navigateToLogin(authUser =>
            navigate(SCREENS.MyCollection, { userId: authUser.id }),
          );
        } else {
          navigate(SCREENS.MyCollection, { userId: user.id });
        }
        break;
      case 'connection':
        if (!user) {
          this.navigateToLogin(authUser =>
            navigate(SCREENS.MyConnection, { userId: authUser.id }),
          );
        } else {
          navigate(SCREENS.MyConnection, { userId: user.id });
        }
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
  };

  handleOnPressSignUp = () => {
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
    navigate(SCREENS.Login, {
      onLoginSuccess,
    });
  };

  handleOnPressLogin = () => {
    this.navigateToLogin();
  };

  handleOnPressAvatar = () => {
    const { user, navigation: { navigate } } = this.props;
    navigate(SCREENS.UserDetail, {
      userId: user.id,
    });
  };

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

  renderList = list => {
    const { user, i18n } = this.props;
    if (!user && list.some(l => l.id === 'logout')) {
      list = list.filter(l => l.id !== 'logout');
    }
    return (
      <List>
        {list.map(item => (
          <ListItem
            key={item.id}
            title={i18n[item.title]}
            leftIcon={{
              name: item.icon,
              type: item.type,
              style: { width: 30, textAlign: 'center' },
            }}
            onPress={() => this.handleOnPressListItem(item)}
          />
        ))}
      </List>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        {
          <ScrollView style={styles.container}>
            {this.renderCover()}
            {this.renderList(menuList)}
            {this.renderList(menuList2)}
          </ScrollView>
        }
      </View>
    );
  }
}

export default connectLocalization(
  connect(
    state => ({
      user: state.auth.user,
    }),
    {
      ...authActionCreators,
      ...browsingHistoryActionCreators,
    },
  )(MyPage),
);
