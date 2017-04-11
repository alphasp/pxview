import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import UserListContainer from './UserListContainer';
import * as userFollowingActionCreators from '../common/actions/userFollowing';
import { denormalizedData } from '../common/helpers/normalizrHelper';
import Schemas from '../common/constants/schemas';

class UserFollowing extends Component {
  static propTypes = {
    userId: PropTypes.number.isRequired,
    userFollowing: PropTypes.object.isRequired,
    followingType: PropTypes.string.isRequired,
    fetchUserFollowing: PropTypes.func.isRequired,
    clearUserFollowing: PropTypes.func.isRequired,
  }

  componentDidMount() {
    const { fetchUserFollowing, userId, followingType } = this.props;
    fetchUserFollowing(userId, followingType);
  }

  loadMore = () => {
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
    const { userFollowing, userId, screenProps } = this.props;
    return (
      <UserListContainer
        userList={userFollowing}
        loadMore={this.loadMore}
        onRefresh={this.handleOnRefresh}
        screenProps={screenProps}
      />
    );
  }
}

export default connect((state, props) => {
  const { entities, userFollowing } = state;
  const userId = props.userId || props.navigation.state.params.userId;
  return {
    userFollowing: denormalizedData(userFollowing[props.followingType][userId], 'items', Schemas.USER_PREVIEW_ARRAY, entities),
    userId
  }
}, userFollowingActionCreators)(UserFollowing);