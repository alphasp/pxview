import React from 'react';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import UserList from '../components/UserList';
import * as followUserActionCreators from '../common/actions/followUser';

const UserListContainer = props => <UserList {...props} />;

export default withNavigation(
  connect(null, followUserActionCreators)(UserListContainer),
);
