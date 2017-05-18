import React, { Component } from 'react';
import { connect } from 'react-redux';
import UserListContainer from '../../../containers/UserListContainer';
import * as userMyPixivActionCreators
  from '../../../common/actions/userMyPixiv';
import { makeGetUserMyPixivItems } from '../../../common/selectors';

class UserMyPixiv extends Component {
  componentDidMount() {
    const { fetchUserMyPixiv, userId } = this.props;
    fetchUserMyPixiv(userId);
  }

  loadMoreItems = () => {
    const { fetchUserMyPixiv, userMyPixiv, userId } = this.props;
    if (userMyPixiv && !userMyPixiv.loading && userMyPixiv.nextUrl) {
      fetchUserMyPixiv(userId, userMyPixiv.nextUrl);
    }
  };

  handleOnRefresh = () => {
    const { clearUserMyPixiv, fetchUserMyPixiv, userId } = this.props;
    clearUserMyPixiv(userId);
    fetchUserMyPixiv(userId, null, true);
  };

  render() {
    const { userMyPixiv, items } = this.props;
    return (
      <UserListContainer
        userList={{ ...userMyPixiv, items }}
        loadMoreItems={this.loadMoreItems}
        onRefresh={this.handleOnRefresh}
      />
    );
  }
}

export default connect(() => {
  const getUserMyPixivItems = makeGetUserMyPixivItems();
  return (state, props) => {
    const { userMyPixiv } = state;
    const userId = props.userId || props.navigation.state.params.userId;
    return {
      userMyPixiv: userMyPixiv[userId],
      items: getUserMyPixivItems(state, props),
      userId,
    };
  };
}, userMyPixivActionCreators)(UserMyPixiv);
