import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import UserListContainer from './UserListContainer';
import * as userFollowersActionCreators from '../common/actions/userFollowers';
import { makeGetUserFollowersItems } from '../common/selectors';

class UserFollowers extends Component {
  static propTypes = {
    userId: PropTypes.number.isRequired,
    userFollowers: PropTypes.object,
    items: PropTypes.array,
    fetchUserFollowers: PropTypes.func.isRequired,
    clearUserFollowers: PropTypes.func.isRequired,
  }

  componentDidMount() {
    const { fetchUserFollowers, userId } = this.props;
    fetchUserFollowers(userId);
  }

  loadMoreItems = () => {
    const { fetchUserFollowers, userFollowers, userId } = this.props;
    if (userFollowers && !userFollowers.loading && userFollowers.nextUrl) {
      fetchUserFollowers(userId, userFollowers.nextUrl);
    }
  }

  handleOnRefresh = () => {
    const { clearUserFollowers, fetchUserFollowers, userId } = this.props;
    clearUserFollowers(userId);
    fetchUserFollowers(userId, null, true);
  }

  render() {
    const { userFollowers, items, userId, screenProps } = this.props;
    return (
      <UserListContainer
        userList={{...userFollowers, items}}
        loadMoreItems={this.loadMoreItems}
        onRefresh={this.handleOnRefresh}
        screenProps={screenProps}
      />
    );
  }
}

export default connect(() => {
  const getUserFollowersItems = makeGetUserFollowersItems();
  return (state, props) => {
    const { userFollowers } = state;
    const userId = props.userId || props.navigation.state.params.userId;
    return {
      userFollowers: userFollowers[userId],
      items: getUserFollowersItems(state, props),
      userId
    }
  }
}, userFollowersActionCreators)(UserFollowers);