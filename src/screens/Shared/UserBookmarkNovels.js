import React, { Component } from 'react';
import { InteractionManager } from 'react-native';
import { connect } from 'react-redux';
import NovelList from '../../components/NovelList';
import * as userBookmarkNovelsActionCreators from '../../common/actions/userBookmarkNovels';
import { makeGetUserBookmarkNovelsItems } from '../../common/selectors';

class UserBookmarkNovels extends Component {
  componentDidMount() {
    const {
      userBookmarkNovels,
      userId,
      tag,
      reload,
      fetchUserBookmarkNovels,
      clearUserBookmarkNovels,
    } = this.props;
    if (!userBookmarkNovels || !userBookmarkNovels.items || reload) {
      clearUserBookmarkNovels(userId);
      InteractionManager.runAfterInteractions(() => {
        fetchUserBookmarkNovels(userId, tag);
      });
    }
  }

  componentDidUpdate(prevProps) {
    const {
      userId,
      tag,
      fetchUserBookmarkNovels,
      clearUserBookmarkNovels,
    } = this.props;
    const { userId: prevUserId, tag: prevTag } = prevProps;
    if (userId !== prevUserId || tag !== prevTag) {
      clearUserBookmarkNovels(userId);
      fetchUserBookmarkNovels(userId, tag);
    }
  }

  loadMoreItems = () => {
    const {
      userBookmarkNovels,
      tag,
      userId,
      fetchUserBookmarkNovels,
    } = this.props;
    if (
      userBookmarkNovels &&
      !userBookmarkNovels.loading &&
      userBookmarkNovels.nextUrl
    ) {
      fetchUserBookmarkNovels(userId, tag, userBookmarkNovels.nextUrl);
    }
  };

  handleOnRefresh = () => {
    const {
      userId,
      tag,
      clearUserBookmarkNovels,
      fetchUserBookmarkNovels,
    } = this.props;
    clearUserBookmarkNovels(userId);
    fetchUserBookmarkNovels(userId, tag, null, true);
  };

  render() {
    const { userBookmarkNovels, items, listKey } = this.props;
    return (
      <NovelList
        data={{ ...userBookmarkNovels, items }}
        listKey={listKey}
        loadMoreItems={this.loadMoreItems}
        onRefresh={this.handleOnRefresh}
      />
    );
  }
}

export default connect(() => {
  const getUserBookmarkNovelsItems = makeGetUserBookmarkNovelsItems();
  return (state, props) => {
    const { userBookmarkNovels } = state;
    const userId = props.userId || props.route.params.userId;
    return {
      userBookmarkNovels: userBookmarkNovels[userId],
      items: getUserBookmarkNovelsItems(state, props),
      userId,
      listKey: `${props.route.key}-userbookmarkNovels`,
    };
  };
}, userBookmarkNovelsActionCreators)(UserBookmarkNovels);
