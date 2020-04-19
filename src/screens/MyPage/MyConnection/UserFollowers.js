import React, { Component } from 'react';
import { connect } from 'react-redux';
import UserList from '../../../components/UserList';
import { connectLocalization } from '../../../components/Localization';
import EmptyStateView from '../../../components/EmptyStateView';
import * as userFollowersActionCreators from '../../../common/actions/userFollowers';
import { makeGetUserFollowersItems } from '../../../common/selectors';

class UserFollowers extends Component {
  componentDidMount() {
    const { fetchUserFollowers, clearUserFollowers, userId } = this.props;
    clearUserFollowers(userId);
    fetchUserFollowers(userId);
  }

  loadMoreItems = () => {
    const { fetchUserFollowers, userFollowers, userId } = this.props;
    if (userFollowers && !userFollowers.loading && userFollowers.nextUrl) {
      fetchUserFollowers(userId, userFollowers.nextUrl);
    }
  };

  handleOnRefresh = () => {
    const { clearUserFollowers, fetchUserFollowers, userId } = this.props;
    clearUserFollowers(userId);
    fetchUserFollowers(userId, null, true);
  };

  render() {
    const { userFollowers, items, i18n } = this.props;
    if (userFollowers && userFollowers.loaded && (!items || !items.length)) {
      return (
        <EmptyStateView
          iconName="users"
          iconType="font-awesome"
          title={i18n.noFollowers}
        />
      );
    }
    return (
      <UserList
        userList={{ ...userFollowers, items }}
        loadMoreItems={this.loadMoreItems}
        onRefresh={this.handleOnRefresh}
      />
    );
  }
}

export default connectLocalization(
  connect(() => {
    const getUserFollowersItems = makeGetUserFollowersItems();
    return (state, props) => {
      const { userFollowers } = state;
      const userId = props.userId || props.route.params.userId;
      return {
        userFollowers: userFollowers[userId],
        items: getUserFollowersItems(state, props),
        userId,
      };
    };
  }, userFollowersActionCreators)(UserFollowers),
);
