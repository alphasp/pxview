import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Alert,
  DeviceEventEmitter,
  Linking,
} from 'react-native';
import { List, ListItem } from 'react-native-elements';
import RNFetchBlob from 'react-native-fetch-blob';
import { connectLocalization } from '../../components/Localization';
import { globalStyleVariables } from '../../styles';
import { SCREENS } from '../../common/constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: globalStyleVariables.BACKGROUND_COLOR,
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
    hideChevron: true,
  },
];

const otherList = [
  {
    id: 'donations',
    title: 'donations',
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
        navigate(SCREENS.InitialScreenSettings);
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
        navigate(SCREENS.Language);
        break;
      }
      case 'about': {
        navigate(SCREENS.About);
        break;
      }
      case 'donations': {
        Linking.openURL(
          `https://github.com/alphasp/pxview/blob/master/donations/${this.getLanguage(
            i18n.language,
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
    const { i18n } = this.props;
    return (
      <List>
        {list.map(item =>
          <ListItem
            key={item.id}
            title={i18n[item.title]}
            onPress={() => this.handleOnPressListItem(item)}
            hideChevron={item.hideChevron}
          />,
        )}
      </List>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        {
          <ScrollView style={styles.container}>
            {this.renderList(settingsList)}
            {this.renderList(otherList)}
          </ScrollView>
        }
      </View>
    );
  }
}

export default connectLocalization(Settings);
