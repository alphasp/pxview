import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Alert,
  DeviceEventEmitter,
  Linking,
} from 'react-native';
import { connect } from 'react-redux';
import { withTheme } from 'react-native-paper';
import RNFetchBlob from 'rn-fetch-blob';
import { connectLocalization } from '../../components/Localization';
import PXListItem from '../../components/PXListItem';
import * as modalActionCreators from '../../common/actions/modal';
import { SCREENS, MODAL_TYPES } from '../../common/constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const settingsList = [
  {
    id: 'accountSettings',
    title: 'accountSettings',
  },
  {
    id: 'saveImageSettings',
    title: 'saveImageSettings',
  },
  {
    id: 'initialScreenSettings',
    title: 'initialScreenSettings',
  },
  {
    id: 'tagHighlightSettings',
    title: 'tagHighlightSettings',
  },
  {
    id: 'tagMuteSettings',
    title: 'tagMuteSettings',
  },
  {
    id: 'userMuteSettings',
    title: 'userMuteSettings',
  },
  {
    id: 'lang',
    title: 'lang',
  },
  {
    id: 'cacheClear',
    title: 'cacheClear',
  },
];

const otherList = [
  {
    id: 'donations',
    title: 'donations',
  },
  {
    id: 'privacyPolicy',
    title: 'privacyPolicy',
  },
  {
    id: 'about',
    title: 'about',
  },
];

class Settings extends Component {
  getLanguage = lang => {
    const zhIds = ['zh', 'zh-CN', 'zh-SG'];
    const zhHantIds = ['zh-TW', 'zh-HK', 'zh-MO'];
    if (zhIds.includes(lang)) {
      return 'zh';
    } else if (zhHantIds.includes(lang)) {
      return 'zh-TW';
    } else if (lang === 'ja') {
      return 'ja';
    }
    return 'en';
  };

  mapScreenName = routeId => {
    const { i18n } = this.props;
    switch (routeId) {
      case SCREENS.Recommended:
        return i18n.recommended;
      case SCREENS.Ranking:
        return i18n.ranking;
      case SCREENS.Trending:
        return i18n.search;
      case SCREENS.NewWorks:
        return i18n.newest;
      default:
        return '';
    }
  };

  mapLanguageName = lang => {
    switch (lang) {
      case 'ja':
        return '日本語';
      case 'zh':
        return '中文(简体)';
      case 'zh-TW':
        return '中文(繁體)';
      default:
        return 'English';
    }
  };

  handleOnPressInitialScreenSettings = () => {
    const { openModal, initialScreenId } = this.props;
    openModal(MODAL_TYPES.INITIAL_SCREEN_SETTINGS, {
      initialScreenId,
    });
  };

  handleOnPressLanguageSettings = () => {
    const { openModal, lang } = this.props;
    openModal(MODAL_TYPES.LANGUAGE_SETTINGS, {
      lang,
    });
  };
  handleOnPressListItem = item => {
    const { navigation: { navigate }, i18n } = this.props;
    switch (item.id) {
      case 'accountSettings': {
        navigate(SCREENS.AccountSettings);
        break;
      }
      case 'saveImageSettings': {
        navigate(SCREENS.SaveImageSettings);
        break;
      }
      case 'initialScreenSettings': {
        this.handleOnPressInitialScreenSettings();
        break;
      }
      case 'tagHighlightSettings': {
        navigate(SCREENS.HighlightTagsSettings);
        break;
      }
      case 'tagMuteSettings': {
        navigate(SCREENS.MuteTagsSettings);
        break;
      }
      case 'userMuteSettings': {
        navigate(SCREENS.MuteUsersSettings);
        break;
      }
      case 'lang': {
        this.handleOnPressLanguageSettings();
        break;
      }
      case 'privacyPolicy': {
        navigate(SCREENS.PrivacyPolicy);
        break;
      }
      case 'about': {
        navigate(SCREENS.About);
        break;
      }
      case 'donations': {
        Linking.openURL(
          `https://github.com/alphasp/pxview/blob/master/donations/${this.getLanguage(
            i18n.getLanguage(),
          )}.md`,
        );
        break;
      }
      case 'cacheClear': {
        Alert.alert(
          i18n.cacheClearConfirmation,
          null,
          [
            { text: i18n.cancel, style: 'cancel' },
            { text: i18n.ok, onPress: this.handleOnPressConfirmClearCache },
          ],
          { cancelable: false },
        );
        break;
      }
      default:
        break;
    }
  };

  handleOnPressConfirmClearCache = () => {
    const { i18n } = this.props;
    RNFetchBlob.fs
      .unlink(`${RNFetchBlob.fs.dirs.CacheDir}/pxview/`)
      .then(() => {
        DeviceEventEmitter.emit('showToast', i18n.cacheClearSuccess);
      })
      .catch(() => {});
  };

  renderList = list => {
    const { i18n, initialScreenId, lang } = this.props;
    return (
      <View>
        {list.map(item => {
          let description;
          if (item.id === 'initialScreenSettings') {
            description = this.mapScreenName(initialScreenId);
          } else if (item.id === 'lang') {
            description = this.mapLanguageName(lang);
          }
          return (
            <PXListItem
              key={item.id}
              title={i18n[item.title]}
              description={description}
              onPress={() => this.handleOnPressListItem(item)}
            />
          );
        })}
      </View>
    );
  };

  render() {
    const { theme } = this.props;
    return (
      <ScrollView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        {this.renderList(settingsList)}
        {this.renderList(otherList)}
      </ScrollView>
    );
  }
}

export default withTheme(
  connectLocalization(
    connect(
      state => ({
        initialScreenId: state.initialScreenSettings.routeName,
        lang: state.i18n.lang,
      }),
      modalActionCreators,
    )(Settings),
  ),
);
