import React, { Component } from 'react';
import { connect } from 'react-redux';
import UserListContainer from '../../../containers/UserListContainer';
import * as userFollowingActionCreators
  from '../../../common/actions/userFollowing';
import { makeGetUserFollowingItems } from '../../../common/selectors';

class UserFollowing extends Component {
  componentDidMount() {
    const { fetchUserFollowing, clearUserFollowing, userId, followingType } = this.props;
    clearUserFollowing(userId, followingType);
    fetchUserFollowing(userId, followingType);
  }

  loadMoreItems = () => {
    const {
      fetchUserFollowing,
      userFollowing,
      userId,
      followingType,
    } = this.props;
    if (userFollowing && userFollowing.nextUrl) {
      fetchUserFollowing(userId, followingType, userFollowing.nextUrl);
    }
  };

  handleOnRefresh = () => {
    const {
      clearUserFollowing,
      fetchUserFollowing,
      userId,
      followingType,
    } = this.props;
    clearUserFollowing(userId, followingType);
    fetchUserFollowing(userId, followingType, null, true);
  };

  render() {
    const { userFollowing, items } = this.props;
    return (
      <UserListContainer
        userList={{ ...userFollowing, items }}
        loadMoreItems={this.loadMoreItems}
        onRefresh={this.handleOnRefresh}
      />
    );
  }
}

export default connect(() => {
  const getUserFollowingItems = makeGetUserFollowingItems();
  return (state, props) => {
    const { userFollowing } = state;
    const userId = props.userId || props.navigation.state.params.userId;
    const { followingType } = props;
    return {
      userFollowing: userFollowing[followingType][userId],
      items: getUserFollowingItems(state, props),
      userId,
    };
  };
}, userFollowingActionCreators)(UserFollowing);
