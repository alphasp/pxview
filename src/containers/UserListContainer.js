import React from 'react';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import { withTheme } from 'react-native-paper';
import UserList from '../components/UserList';
import * as followUserActionCreators from '../common/actions/followUser';

const UserListContainer = props => <UserList {...props} />;

export default withTheme(
  withNavigation(connect(null, followUserActionCreators)(UserListContainer)),
);
