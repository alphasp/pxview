import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-native-elements';
import UserListContainer from '../../../containers/UserListContainer';
import { connectLocalization } from '../../../components/Localization';
import EmptyStateView from '../../../components/EmptyStateView';
import * as userFollowingActionCreators from '../../../common/actions/userFollowing';
import { makeGetUserFollowingItems } from '../../../common/selectors';
import { SCREENS } from '../../../common/constants';
import { globalStyleVariables } from '../../../styles';

class UserFollowing extends Component {
  componentDidMount() {
    const {
      fetchUserFollowing,
      clearUserFollowing,
      userId,
      followingType,
    } = this.props;
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

  handleOnPressFindRecommendedUsers = () => {
    const { push } = this.props.navigation;
    push(SCREENS.RecommendedUsers);
  };

  render() {
    const { userFollowing, items, i18n } = this.props;
    if (userFollowing && userFollowing.loaded && (!items || !items.length)) {
      return (
        <EmptyStateView
          iconName="users"
          iconType="font-awesome"
          title={i18n.noFollowUser}
          actionButton={
            <Button
              title={i18n.recommendedUsersFind}
              backgroundColor={globalStyleVariables.PRIMARY_COLOR}
              onPress={this.handleOnPressFindRecommendedUsers}
              raised
            />
          }
        />
      );
    }
    return (
      <UserListContainer
        userList={{ ...userFollowing, items }}
        loadMoreItems={this.loadMoreItems}
        onRefresh={this.handleOnRefresh}
      />
    );
  }
}

export default connectLocalization(
  connect(
    () => {
      const getUserFollowingItems = makeGetUserFollowingItems();
      return (state, props) => {
        const { userFollowing } = state;
        const userId = props.userId || props.route.params.userId;
        const followingType =
          props.followingType || props.route.params.followingType;
        return {
          userFollowing: userFollowing[followingType][userId],
          items: getUserFollowingItems(state, props),
          userId,
          followingType,
        };
      };
    },
    userFollowingActionCreators,
  )(UserFollowing),
);
