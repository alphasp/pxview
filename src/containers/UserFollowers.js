import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import UserListContainer from './UserListContainer';
import * as userFollowersActionCreators from '../common/actions/userFollowers';
import { denormalizedData } from '../common/helpers/normalizrHelper';
import Schemas from '../common/constants/schemas';

class UserFollowers extends Component {
  static propTypes = {
    userId: PropTypes.number.isRequired,
    userFollowers: PropTypes.object.isRequired,
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
    const { userFollowers, userId, screenProps } = this.props;
    return (
      <UserListContainer
        userList={userFollowers}
        loadMoreItems={this.loadMoreItems}
        onRefresh={this.handleOnRefresh}
        screenProps={screenProps}
      />
    );
  }
}

export default connect((state, props) => {
  const { entities, userFollowers } = state;
  const userId = props.userId || props.navigation.state.params.userId;
  return {
    userFollowers: denormalizedData(userFollowers[userId], 'items', Schemas.USER_PREVIEW_ARRAY, entities),
    userId
  }
}, userFollowersActionCreators)(UserFollowers);