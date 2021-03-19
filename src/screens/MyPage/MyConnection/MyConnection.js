import React, { Component } from 'react';
import UserFollowing from './UserFollowing';
import UserFollowers from './UserFollowers';
import UserMyPixiv from './UserMyPixiv';
import { connectLocalization } from '../../../components/Localization';
import PXTabView from '../../../components/PXTabView';
import { FOLLOWING_TYPES } from '../../../common/constants';

class MyConnection extends Component {
  constructor(props) {
    super(props);
    const { i18n } = props;
    this.state = {
      index: 0,
      routes: [
        { key: '1', title: i18n.followingPublic },
        { key: '2', title: i18n.followingPrivate },
        { key: '3', title: i18n.follower },
        { key: '4', title: i18n.myPixiv },
      ],
    };
  }

  handleChangeTab = (index) => {
    this.setState({ index });
  };

  renderScene = ({ route }) => {
    const { navigation, route: navigationRoute } = this.props;
    const { userId } = navigationRoute.params;

    switch (route.key) {
      case '1':
        return (
          <UserFollowing
            userId={userId}
            followingType={FOLLOWING_TYPES.PUBLIC}
            navigation={navigation}
            route={navigationRoute}
          />
        );
      case '2':
        return (
          <UserFollowing
            userId={userId}
            followingType={FOLLOWING_TYPES.PRIVATE}
            navigation={navigation}
            route={navigationRoute}
          />
        );
      case '3':
        return (
          <UserFollowers
            userId={userId}
            navigation={navigation}
            route={navigationRoute}
          />
        );
      case '4':
        return (
          <UserMyPixiv
            userId={userId}
            navigation={navigation}
            route={navigationRoute}
          />
        );
      default:
        return null;
    }
  };

  render() {
    return (
      <PXTabView
        navigationState={this.state}
        renderScene={this.renderScene}
        onIndexChange={this.handleChangeTab}
        scrollEnabled
      />
    );
  }
}

export default connectLocalization(MyConnection);
