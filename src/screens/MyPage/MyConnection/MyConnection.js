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

  componentWillReceiveProps(nextProps) {
    const { lang: prevLang } = this.props;
    const { lang, i18n } = nextProps;
    if (lang !== prevLang) {
      this.setState({
        routes: [
          { key: '1', title: i18n.followingPublic },
          { key: '2', title: i18n.followingPrivate },
          { key: '3', title: i18n.follower },
          { key: '4', title: i18n.myPixiv },
        ],
      });
    }
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
        return <UserFollowers userId={userId} />;
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

export default connectLocalization(MyConnection);
