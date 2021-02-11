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
    id: 'readingSettings',
    title: 'readingSettings',
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
    id: 'likeButtonSettings',
    title: 'likeButtonSettings',
  },
  {
    id: 'trendingSearchSettings',
    title: 'trendingSearchSettings',
  },
  {
    id: 'tagHighlightSettings',
    title: 'tagHighlightSettings',
  },
  {
    id: 'muteSettings',
    title: 'muteSettings',
  },
  {
    id: 'lang',
    title: 'lang',
  },
  {
    id: 'backup',
    title: 'backup',
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
  getLanguage = (lang) => {
    const zhIds = ['zh', 'zh-CN', 'zh-SG'];
    const zhHantIds = ['zh-TW', 'zh-HK', 'zh-MO'];
    if (zhIds.includes(lang)) {
      return 'zh';
    }
    if (zhHantIds.includes(lang)) {
      return 'zh-TW';
    }
    if (lang === 'ja') {
      return 'ja';
    }
    return 'en';
  };

  mapScreenName = (routeId) => {
    const { i18n } = this.props;
    switch (routeId) {
      case SCREENS.Recommended:
        return i18n.recommended;
      case SCREENS.RankingPreview:
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

  mapLanguageName = (lang) => {
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

  handleOnPressListItem = (item) => {
    const {
      navigation: { navigate },
      i18n,
    } = this.props;
    switch (item.id) {
      case 'accountSettings': {
        navigate(SCREENS.AccountSettings);
        break;
      }
      case 'readingSettings': {
        navigate(SCREENS.ReadingSettings);
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
      case 'likeButtonSettings': {
        navigate(SCREENS.LikeButtonSettings);
        break;
      }
      case 'muteSettings': {
        navigate(SCREENS.MuteSettings);
        break;
      }
      case 'trendingSearchSettings': {
        navigate(SCREENS.TrendingSearchSettings);
        break;
      }
      case 'tagHighlightSettings': {
        navigate(SCREENS.HighlightTagsSettings);
        break;
      }
      case 'backup': {
        navigate(SCREENS.Backup);
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

  handleOnPressConfirmClearCache = async () => {
    const { i18n } = this.props;
    const { dirs, exists, unlink } = RNFetchBlob.fs;
    try {
      const isCacheDirExists = await exists(dirs.CacheDir);
      if (isCacheDirExists) {
        await unlink(dirs.CacheDir);
      }
      DeviceEventEmitter.emit('showToast', i18n.cacheClearSuccess);
    } catch (err) {}
  };

  renderList = (list) => {
    const { i18n, initialScreenId, lang } = this.props;
    return (
      <View>
        {list.map((item) => {
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
      (state) => ({
        initialScreenId: state.initialScreenSettings.routeName,
        lang: state.i18n.lang,
      }),
      modalActionCreators,
    )(Settings),
  ),
);
