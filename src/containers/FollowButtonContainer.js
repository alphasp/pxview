import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FollowButton from '../components/FollowButton';
import * as followUserActionCreators from '../common/actions/followUser';
import * as modalActionCreators from '../common/actions/modal';
import { FOLLOWING_TYPES, MODAL_TYPES } from '../common/constants';
import { makeGetUserItem } from '../common/selectors';

class FollowButtonContainer extends Component {
  static propTypes = {
    userId: PropTypes.number.isRequired,
    followUser: PropTypes.func.isRequired,
    unfollowUser: PropTypes.func.isRequired,
    openModal: PropTypes.func.isRequired,
  };

  handleOnPress = () => {
    const { user } = this.props;
    if (user.is_followed) {
      this.unfollowUser(user.id);
    } else {
      this.followUser(user.id, FOLLOWING_TYPES.PUBLIC);
    }
  };

  handleOnLongPress = () => {
    const { user, openModal } = this.props;
    openModal(MODAL_TYPES.FOLLOW, {
      userId: user.id,
      isFollow: user.is_followed,
    });
  };

  followUser = (userId, followType) => {
    const { followUser } = this.props;
    followUser(userId, followType);
  };

  unfollowUser = (userId) => {
    const { unfollowUser } = this.props;
    unfollowUser(userId);
  };

  render() {
    const { user, ...restProps } = this.props;
    return (
      <FollowButton
        isFollow={user.is_followed}
        onLongPress={this.handleOnLongPress}
        onPress={this.handleOnPress}
        {...restProps}
      />
    );
  }
}

export default connect(
  () => {
    const getUserItem = makeGetUserItem();
    return (state, props) => {
      const user = getUserItem(state, props);
      return {
        user,
      };
    };
  },
  { ...followUserActionCreators, ...modalActionCreators },
)(FollowButtonContainer);
