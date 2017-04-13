import React, { Component } from 'react';
import { connect } from 'react-redux';
import UserListContainer from './UserListContainer';
import * as recommendedUsersActionCreators from '../common/actions/recommendedUsers';
import { denormalizedData } from '../common/helpers/normalizrHelper';
import Schemas from '../common/constants/schemas';

class RecommendedUsers extends Component {
  componentDidMount() {
    const { fetchRecommendedUsers } = this.props;
    fetchRecommendedUsers();
  }

  loadMore = () => {
    const { fetchRecommendedUsers, recommendedUsers: { nextUrl, loading } } = this.props;
    if (!loading && nextUrl) {
      console.log('load more ', nextUrl)
      fetchRecommendedUsers(null, nextUrl);
    }
  }

  handleOnRefresh = () => {
    const { fetchRecommendedUsers, clearRecommendedUsers } = this.props;
    clearRecommendedUsers();
    fetchRecommendedUsers(null, null, true);
  }

  render() {
    const { recommendedUsers, navigation, screenProps } = this.props;
    return (
      <UserListContainer
        userList={recommendedUsers}
        loadMore={this.loadMore}
        onRefresh={this.handleOnRefresh}
        screenProps={screenProps}
      />
    );
  }
}

export default connect(state => {
  const { entities, recommendedUsers } = state;
  return {
    recommendedUsers: denormalizedData(recommendedUsers, 'items', Schemas.USER_PREVIEW_ARRAY, entities),
  }
}, recommendedUsersActionCreators)(RecommendedUsers);