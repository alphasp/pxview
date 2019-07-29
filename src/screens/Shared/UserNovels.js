import React, { Component } from 'react';
import { InteractionManager } from 'react-native';
import { connect } from 'react-redux';
import NovelList from '../../components/NovelList';
import * as userNovelsActionCreators from '../../common/actions/userNovels';
import { makeGetUserNovelsItems } from '../../common/selectors';

class UserNovels extends Component {
  componentDidMount() {
    const { userNovels, userId, fetchUserNovels, clearUserNovels } = this.props;
    if (!userNovels || !userNovels.items) {
      clearUserNovels(userId);
      InteractionManager.runAfterInteractions(() => {
        fetchUserNovels(userId);
      });
    }
  }

  loadMoreItems = () => {
    const { userNovels, userId, fetchUserNovels } = this.props;
    if (userNovels && !userNovels.loading && userNovels.nextUrl) {
      fetchUserNovels(userId, userNovels.nextUrl);
    }
  };

  handleOnRefresh = () => {
    const { userId, fetchUserNovels, clearUserNovels } = this.props;
    clearUserNovels(userId);
    fetchUserNovels(userId, null, true);
  };

  render() {
    const { userNovels, items, listKey } = this.props;
    return (
      <NovelList
        data={{ ...userNovels, items }}
        listKey={listKey}
        loadMoreItems={this.loadMoreItems}
        onRefresh={this.handleOnRefresh}
      />
    );
  }
}

export default connect(
  () => {
    const getUserNovelsItems = makeGetUserNovelsItems();
    return (state, props) => {
      const { userNovels } = state;
      const userId = props.userId || props.navigation.state.params.userId;
      return {
        userNovels: userNovels[userId],
        items: getUserNovelsItems(state, props),
        userId,
        listKey: props.navigation.state.key,
      };
    };
  },
  userNovelsActionCreators,
)(UserNovels);
