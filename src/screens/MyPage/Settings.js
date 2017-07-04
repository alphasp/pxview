import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Alert,
  DeviceEventEmitter,
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
    id: 'about',
    title: 'about',
  },
];

class Settings extends Component {
  handleOnPressListItem = item => {
    const { navigation: { navigate }, i18n } = this.props;
    switch (item.id) {
      case 'accountSettings': {
        navigate(SCREENS.AccountSettings);
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
        {list.map(item => (
          <ListItem
            key={item.id}
            title={i18n[item.title]}
            onPress={() => this.handleOnPressListItem(item)}
            hideChevron={item.hideChevron}
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
            {this.renderList(settingsList)}
            {this.renderList(otherList)}
          </ScrollView>
        }
      </View>
    );
  }
}

export default connectLocalization(Settings);
