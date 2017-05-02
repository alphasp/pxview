import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  View,
  ListView,
  Dimensions,
  RecyclerViewBackedScrollView,
  ScrollView,
} from 'react-native';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import FollowButton from '../components/FollowButton';
import * as followUserActionCreators from '../common/actions/followUser';
import * as modalActionCreators from '../common/actions/modal';
import { FOLLOWING_TYPES } from '../common/constants/followingTypes';
import modalType from '../common/constants/modalType';

class FollowButtonContainer extends Component {
  static propTypes = {
    authUser: PropTypes.object,
    user: PropTypes.object.isRequired,
    followUser: PropTypes.func.isRequired,
    unfollowUser: PropTypes.func.isRequired,
    navigation: PropTypes.object.isRequired,
    openModal: PropTypes.func.isRequired,
  }

  handleOnPress = () => {
    const { authUser, user, navigation: { navigate } } = this.props;
    if (!authUser) {
      navigate('Login', {
        onLoginSuccess: () => {
          this.followUser(user.id, FOLLOWING_TYPES.PUBLIC);
        },
      });
    }
    else if (user.is_followed) {
      this.unfollowUser(user.id);
    }
    else {
      this.followUser(user.id, FOLLOWING_TYPES.PUBLIC);
    }
  }

  handleOnLongPress = () => {
    const { authUser, user, navigation: { navigate }, openModal } = this.props;
    if (!authUser) {
      navigate('Login', {
        onLoginSuccess: () => {
          this.followUser(user.id, FOLLOWING_TYPES.PUBLIC);
        },
      });
    }
    else {
      openModal(modalType.FOLLOW, {
        userId: user.id,
        isFollow: user.is_followed,
      });
    }
  }

  followUser = (userId, followType) => {
    const { followUser } = this.props;
    followUser(userId, followType);
  }

  unfollowUser = userId => {
    const { unfollowUser } = this.props;
    unfollowUser(userId);
  }

  render() {
    const { user, restProps } = this.props;
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

export default withNavigation(connect((state, props) => ({
  authUser: state.auth.user,
}), { ...followUserActionCreators, ...modalActionCreators })(FollowButtonContainer));
