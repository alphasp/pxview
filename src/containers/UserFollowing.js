import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import UserListContainer from './UserListContainer';
import * as userFollowingActionCreators from '../common/actions/userFollowing';
import { makeGetUserFollowingItems } from '../common/selectors';

class UserFollowing extends Component {
  static propTypes = {
    userId: PropTypes.number.isRequired,
    userFollowing: PropTypes.object,
    items: PropTypes.array,
    followingType: PropTypes.string.isRequired,
    fetchUserFollowing: PropTypes.func.isRequired,
    clearUserFollowing: PropTypes.func.isRequired,
  }

  componentDidMount() {
    const { fetchUserFollowing, userId, followingType } = this.props;
    fetchUserFollowing(userId, followingType);
  }

  loadMoreItems = () => {
    const { fetchUserFollowing, userFollowing, userId, followingType } = this.props;
    if (userFollowing && userFollowing.nextUrl) {
      fetchUserFollowing(userId, followingType, userFollowing.nextUrl);
    }
  }

  handleOnRefresh = () => {
    const { clearUserFollowing, fetchUserFollowing, userId, followingType } = this.props;
    clearUserFollowing(userId, followingType);
    fetchUserFollowing(userId, followingType, null, true);
  }

  render() {
    const { userFollowing, items, userId, screenProps } = this.props;
    return (
      <UserListContainer
        userList={{ ...userFollowing, items }}
        loadMoreItems={this.loadMoreItems}
        onRefresh={this.handleOnRefresh}
        screenProps={screenProps}
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
