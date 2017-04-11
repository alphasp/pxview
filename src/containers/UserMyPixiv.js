import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import UserListContainer from './UserListContainer';
import * as userMyPixivActionCreators from '../common/actions/userMyPixiv';
import { denormalizedData } from '../common/helpers/normalizrHelper';
import Schemas from '../common/constants/schemas';

class UserMyPixiv extends Component {
  static propTypes = {
    userId: PropTypes.number.isRequired,
    userMyPixiv: PropTypes.object.isRequired,
    fetchUserMyPixiv: PropTypes.func.isRequired,
    clearUserMyPixiv: PropTypes.func.isRequired,
  }

  componentDidMount() {
    const { fetchUserMyPixiv, userId } = this.props;
    fetchUserMyPixiv(userId);
  }

  loadMore = () => {
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
    const { userMyPixiv, userId, screenProps } = this.props;
    return (
      <UserListContainer
        userList={userMyPixiv}
        loadMore={this.loadMore}
        onRefresh={this.handleOnRefresh}
        screenProps={screenProps}
      />
    );
  }
}

export default connect((state, props) => {
  const { entities, userMyPixiv } = state;
  const userId = props.userId || props.navigation.state.params.userId;
  return {
    userMyPixiv: denormalizedData(userMyPixiv[userId], 'items', Schemas.USER_PREVIEW_ARRAY, entities),
    userId
  }
}, userMyPixivActionCreators)(UserMyPixiv);