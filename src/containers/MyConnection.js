import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Dimensions,
  Platform,
} from 'react-native';
import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view';
import UserFollowing from './UserFollowing';
import UserFollower from './UserFollower';
import UserMyPixiv from './UserMyPixiv';
import { FollowingType } from '../common/actions/userFollowing';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

class MyConnection extends Component {
  handleOnChangeTab = ({ i, ref }) => {
    this.setState({
      currentTabIndex: i
    })
  }

  render() {
    //const { userId } = this.props;
    const { userId } = this.props.navigation.state.params;
    return (
      <View style={styles.container}>
        <ScrollableTabView renderTabBar={() => <ScrollableTabBar />}>
          <UserFollowing tabLabel="Following (Public)" userId={userId} followingType={FollowingType.PUBLIC} />
          <UserFollowing tabLabel="Following (Private)" userId={userId} followingType={FollowingType.PRIVATE} />
          <UserFollower tabLabel="Followers" userId={userId} />
          <UserMyPixiv tabLabel="My Pixiv" userId={userId} />
        </ScrollableTabView>
      </View>
    );
  }
}


export default MyConnection;
