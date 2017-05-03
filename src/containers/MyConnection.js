import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Dimensions,
  Platform,
} from 'react-native';
import UserFollowing from './UserFollowing';
import UserFollowers from './UserFollowers';
import UserMyPixiv from './UserMyPixiv';
import PXTabView from '../components/PXTabView';
import { FOLLOWING_TYPES } from '../common/constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

class MyConnection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      routes: [
        { key: '1', title: 'Following (Public)' },
        { key: '2', title: 'Following (Private)' },
        { key: '3', title: 'Followers' },
        { key: '4', title: 'My Pixiv' },
      ],
    };
  }

  handleChangeTab = index => {
    this.setState({ index });
  };

  renderScene = ({ route }) => {
    const { userId } = this.props.navigation.state.params;
    const screenProps = this.props.screenProps || this.props.navigation.state.params.screenProps;
    switch (route.key) {
      case '1':
        return (
          <UserFollowing
            userId={userId}
            followingType={FOLLOWING_TYPES.PUBLIC}
            screenProps={screenProps}
          />
        );
      case '2':
        return (
          <UserFollowing
            userId={userId}
            followingType={FOLLOWING_TYPES.PRIVATE}
            screenProps={screenProps}
          />
        );
      case '3':
        return (
          <UserFollowers
            tabLabel="Followers"
            userId={userId}
            screenProps={screenProps}
          />
        );
      case '4':
        return (
          <UserMyPixiv
            userId={userId}
            screenProps={screenProps}
          />
        );
      default:
        return null;
    }
  }

  render() {
    // const { userId } = this.props;
    const { userId } = this.props.navigation.state.params;
    const screenProps = this.props.screenProps || this.props.navigation.state.params.screenProps;
    return (
      <PXTabView
        navigationState={this.state}
        renderScene={this.renderScene}
        onRequestChangeTab={this.handleChangeTab}
        tabBarProps={{
          scrollEnabled: true,
        }}
      />
    );
  }
}


export default MyConnection;
