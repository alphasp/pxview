import React, { Component } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { List, ListItem } from 'react-native-elements';
import * as i18nActionCreators from '../../common/actions/i18n';
import { globalStyleVariables } from '../../styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: globalStyleVariables.BACKGROUND_COLOR,
  },
});

const languageList = [
  {
    id: 'en',
    title: 'English',
  },
  {
    id: 'ja',
    title: '日本語',
  },
  {
    id: 'zh',
    ids: ['zh', 'zh-CN', 'zh-SG'],
    title: '中文(简体)',
    multipleId: true,
  },
  {
    id: 'zh-TW',
    ids: ['zh-TW', 'zh-HK', 'zh-MO'],
    title: '中文(繁體)',
    multipleId: true,
  },
];

class Settings extends Component {
  handleOnPressListItem = id => {
    const { setLanguage, navigation: { goBack } } = this.props;
    setLanguage(id);
    goBack();
  };

  renderList = list => {
    const { lang } = this.props;
    return (
      <List>
        {list.map(item =>
          <ListItem
            key={item.id}
            title={item.title}
            rightIcon={{
              name: 'check',
              type: 'font-awesome',
              color: globalStyleVariables.PRIMARY_COLOR,
            }}
            hideChevron={
              item.multipleId && item.ids
                ? !item.ids.includes(lang)
                : item.id !== lang
            }
            onPress={() => this.handleOnPressListItem(item.id)}
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
            {this.renderList(languageList)}
          </ScrollView>
        }
      </View>
    );
  }
}

export default connect(
  state => ({
    lang: state.i18n.lang,
  }),
  i18nActionCreators,
)(Settings);
