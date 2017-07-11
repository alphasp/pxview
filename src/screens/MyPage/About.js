import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, Platform, Linking } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { List, ListItem } from 'react-native-elements';
import { connectLocalization } from '../../components/Localization';
import { globalStyles } from '../../styles';

const appStoreUrl = '';
const googlePlayUrl =
  'https://play.google.com/store/apps/details?id=com.utopia.pxview';
const sourceUrl = 'https://github.com/alphasp/pxview';

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 100,
    height: 100,
  },
  nameContainer: {
    flexDirection: 'row',
  },
  name: {
    fontSize: 20,
  },
});

const list = [
  {
    id: 'contactUs',
    title: 'contactUs',
    icon: 'envelope',
    type: 'font-awesome',
  },
  {
    id: 'rateApp',
    title: 'rateApp',
    icon: 'star',
    type: 'font-awesome',
  },
  {
    id: 'sourceCode',
    title: 'sourceCode',
    subtitle: sourceUrl,
    icon: 'github',
    type: 'font-awesome',
  },
];

class About extends Component {
  handleOnPressListItem = item => {
    switch (item.id) {
      case 'contactUs': {
        this.openUrl('mailto:gmerudotcom@gmail.com?subject=About PxView');
        break;
      }
      case 'rateApp': {
        const url = Platform.OS === 'ios' ? appStoreUrl : googlePlayUrl;
        if (Platform.OS === 'android') {
          this.openUrl(url);
        }
        break;
      }
      case 'sourceCode': {
        this.openUrl(sourceUrl);
        break;
      }
      default:
        break;
    }
  };

  openUrl = url => {
    Linking.canOpenURL(url)
      .then(supported => {
        if (!supported) {
          return null;
        }
        return Linking.openURL(url);
      })
      .catch(err => err);
  };

  render() {
    const { i18n } = this.props;
    return (
      <View style={globalStyles.container}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../images/logo.png')} // eslint-disable-line global-require
            style={styles.logo}
          />
          <View style={styles.nameContainer}>
            <Text style={styles.name}>
              PxView v{DeviceInfo.getVersion()}
            </Text>
          </View>
        </View>
        <List>
          {list.map(item =>
            <ListItem
              key={item.id}
              title={i18n.formatString(
                i18n[item.title],
                Platform.OS === 'ios' ? 'App Store' : 'Google Play',
              )}
              leftIcon={{
                name: item.icon,
                type: item.type,
                style: { width: 30, textAlign: 'center' },
              }}
              onPress={() => this.handleOnPressListItem(item)}
              subtitle={item.subtitle}
              hideChevron
            />,
          )}
        </List>
      </View>
    );
  }
}

export default connectLocalization(About);
