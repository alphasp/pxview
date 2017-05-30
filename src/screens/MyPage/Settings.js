import React, { Component } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { List, ListItem } from 'react-native-elements';
import { connectLocalization } from '../../components/Localization';
import { globalStyleVariables } from '../../styles';

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
];

const otherList = [
  {
    id: 'about',
    title: 'about',
  },
];

class Settings extends Component {
  handleOnPressListItem = item => {
    const { navigation: { navigate } } = this.props;
    switch (item.id) {
      case 'accountSettings': {
        // navigate('AccountSettings');
        break;
      }
      case 'lang': {
        navigate('Language');
        break;
      }
      case 'about': {
        // navigate('about');
        break;
      }
      default:
        break;
    }
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
