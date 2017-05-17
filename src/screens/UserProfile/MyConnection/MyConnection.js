import React, { Component } from 'react';
import UserFollowing from './UserFollowing';
import UserFollowers from './UserFollowers';
import UserMyPixiv from './UserMyPixiv';
import PXTabView from '../../../components/PXTabView';
import { FOLLOWING_TYPES } from '../../../common/constants';

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
    switch (route.key) {
      case '1':
        return (
          <UserFollowing
            userId={userId}
            followingType={FOLLOWING_TYPES.PUBLIC}
          />
        );
      case '2':
        return (
          <UserFollowing
            userId={userId}
            followingType={FOLLOWING_TYPES.PRIVATE}
          />
        );
      case '3':
        return <UserFollowers tabLabel="Followers" userId={userId} />;
      case '4':
        return <UserMyPixiv userId={userId} />;
      default:
        return null;
    }
  };

  render() {
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