import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import UserListContainer from './UserListContainer';
import * as userMyPixivActionCreators from '../common/actions/userMyPixiv';
import { makeGetUserMyPixivItems } from '../common/selectors';

class UserMyPixiv extends Component {
  static propTypes = {
    userId: PropTypes.number.isRequired,
    userMyPixiv: PropTypes.object,
    items: PropTypes.array,
    fetchUserMyPixiv: PropTypes.func.isRequired,
    clearUserMyPixiv: PropTypes.func.isRequired,
  }

  componentDidMount() {
    const { fetchUserMyPixiv, userId } = this.props;
    fetchUserMyPixiv(userId);
  }

  loadMoreItems = () => {
    const { fetchUserMyPixiv, userMyPixiv, userId } = this.props;
    if (userMyPixiv && !userMyPixiv.loading && userMyPixiv.nextUrl) {
      fetchUserMyPixiv(userId, userMyPixiv.nextUrl);
    }
  }

  handleOnRefresh = () => {
    const { clearUserMyPixiv, fetchUserMyPixiv, userId } = this.props;
    clearUserMyPixiv(userId);
    fetchUserMyPixiv(userId, null, true);
  }

  render() {
    const { userMyPixiv, items, userId, screenProps } = this.props;
    return (
      <UserListContainer
        userList={{ ...userMyPixiv, items }}
        loadMoreItems={this.loadMoreItems}
        onRefresh={this.handleOnRefresh}
        screenProps={screenProps}
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
