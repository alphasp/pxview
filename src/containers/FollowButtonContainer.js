import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  View,
  ListView,
  Dimensions,
  RecyclerViewBackedScrollView,
  ScrollView
} from 'react-native';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import FollowButton from '../components/FollowButton';
import * as followUserActionCreators from '../common/actions/followUser';
import * as modalActionCreators from '../common/actions/modal';
import { FollowType } from '../common/actions/followUser';
import modalType from '../common/constants/modalType';

class FollowButtonContainer extends Component {
  static propTypes = {
    authUser: PropTypes.object,
    user: PropTypes.object.isRequired,
    followUser: PropTypes.func.isRequired,
    unFollowUser: PropTypes.func.isRequired,
    navigation: PropTypes.object.isRequired,
    openModal: PropTypes.func.isRequired
  }

  handleOnPressFollowButton = () => {
    const { authUser, user, navigation: { navigate } } = this.props;
    if (!authUser) {
      navigate('Login', {
        onLoginSuccess: () => {
          this.followUser(user.id, FollowType.PUBLIC);
        }
      });
    }
    else {
      if (user.is_followed) {
        this.unFollowUser(user.id);
      }
      else {
        this.followUser(user.id, FollowType.PUBLIC);
      }
    }
  }

  handleOnLongPressFollowButton = () => {
    console.log('fbc ', this.props)
    const { authUser, user, navigation: { navigate }, openModal } = this.props;
    if (!authUser) {
      navigate('Login', {
        onLoginSuccess: () => {
          this.followUser(user.id, FollowType.PUBLIC);
        }
      });
    }
    else {
      openModal(modalType.FOLLOW, { 
        userId: user.id,
        isFollow: user.is_followed
      })
    }
  }

  followUser = (userId, followType) => {
    const { followUser } = this.props;
    followUser(userId, followType);
  }

  unFollowUser = (userId) => {
    const { unFollowUser } = this.props;
    unFollowUser(userId);
  }

  render() {
    const { user, restProps } = this.props;
    return (
      <FollowButton 
        isFollow={user.is_followed} 
        onLongPress={this.handleOnLongPressFollowButton}
        onPress={this.handleOnPressFollowButton}
        {...restProps}
      />
    );
  }
}

export default withNavigation(connect((state, props) => {
  return {
    authUser: state.auth.user
  }
}, { ...followUserActionCreators, ...modalActionCreators })(FollowButtonContainer));
