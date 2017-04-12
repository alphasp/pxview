import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Dimensions,
  Platform,
} from 'react-native';
import { connect } from 'react-redux';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import FollowingUserIllusts from './FollowingUserIllusts';
import NewIllusts from './NewIllusts';
import NewMangas from './NewMangas';
import MyPixiv from './MyPixiv';
import Login from './Login';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: '#F5FCFF',
    ...Platform.select({
      ios: {
        marginTop: 15
      },
    }),
  },
});

class NewWorks extends Component {
  render() {
    const { user, navigation, screenProps } = this.props;
    return (
      <View style={styles.container}>
        <ScrollableTabView ref={(ref) => this.tabs = ref}>
          <FollowingUserIllusts tabLabel="Following" screenProps={screenProps} navigation={navigation} user={user} />
          <NewIllusts tabLabel="Illust" screenProps={screenProps} />
          <NewMangas tabLabel="Manga" screenProps={screenProps} />
          {
            user &&
            <MyPixiv tabLabel="My Pixiv" screenProps={screenProps} />
          }
        </ScrollableTabView>
      </View> 
    );
  }
}

export default connect(state => {
  return {
    user: state.auth.user
  }
})(NewWorks);