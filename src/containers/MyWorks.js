import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Dimensions,
  Platform,
} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import UserIllusts from './UserIllusts';
import UserMangas from './UserMangas';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...Platform.select({
      ios: {
        marginTop: 15
      },
    }),
  },
});

class MyWorks extends Component {
  render() {
    const { userId } = this.props.navigation.state.params;
    return (
      <View style={styles.container}>
        <ScrollableTabView>
          <UserIllusts tabLabel="Illustrations" userId={userId} />
          <UserMangas tabLabel="Manga" userId={userId} />
        </ScrollableTabView>
      </View>
    );
  }
}

export default MyWorks;
