import React, { Component } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { List, ListItem } from 'react-native-elements';
import { connectLocalization } from '../../components/Localization';
import * as initialScreenSettingsActionCreators from '../../common/actions/initialScreenSettings';
import { globalStyleVariables } from '../../styles';
import { SCREENS } from '../../common/constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: globalStyleVariables.BACKGROUND_COLOR,
  },
});

const screenList = [
  {
    id: SCREENS.Recommended,
  },
  {
    id: SCREENS.Ranking,
  },
  {
    id: SCREENS.Trending,
  },
  {
    id: SCREENS.NewWorks,
  },
];

class InitialScreenSettings extends Component {
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

  handleOnPressListItem = routeId => {
    const { setInitialRoute, navigation: { goBack } } = this.props;
    setInitialRoute(routeId);
    goBack();
  };

  renderList = list => {
    const { routeName } = this.props;
    return (
      <List>
        {list.map(item =>
          <ListItem
            key={item.id}
            title={this.mapScreenName(item.id)}
            rightIcon={{
              name: 'check',
              type: 'font-awesome',
              color: globalStyleVariables.PRIMARY_COLOR,
            }}
            hideChevron={item.id !== routeName}
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
            {this.renderList(screenList)}
          </ScrollView>
        }
      </View>
    );
  }
}

export default connectLocalization(
  connect(
    state => ({
      routeName: state.initialScreenSettings.routeName,
    }),
    initialScreenSettingsActionCreators,
  )(InitialScreenSettings),
);
