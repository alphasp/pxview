import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ListView,
  RecyclerViewBackedScrollView,
  RefreshControl,
} from 'react-native';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import UserList from '../components/UserList';
import * as followUserActionCreators from '../common/actions/followUser';

class UserListContainer extends Component {
  static propTypes = {
    followUser: PropTypes.func.isRequired,
    unFollowUser: PropTypes.func.isRequired
  }

  render() {
    return (
      <UserList {...this.props} />
    );
  }
}

export default withNavigation(connect(null, followUserActionCreators)(UserListContainer));