import React, { Component } from 'react';
import { InteractionManager } from 'react-native';
import { connect } from 'react-redux';
import IllustList from '../../components/IllustList';
import * as userBookmarkIllustsActionCreators from '../../common/actions/userBookmarkIllusts';
import { makeGetUserBookmarkIllustsItems } from '../../common/selectors';

class UserBookmarkIllusts extends Component {
  componentDidMount() {
    const {
      userBookmarkIllusts,
      userId,
      tag,
      reload,
      fetchUserBookmarkIllusts,
      clearUserBookmarkIllusts,
    } = this.props;
    if (!userBookmarkIllusts || !userBookmarkIllusts.items || reload) {
      clearUserBookmarkIllusts(userId);
      InteractionManager.runAfterInteractions(() => {
        fetchUserBookmarkIllusts(userId, tag);
      });
    }
  }

  componentDidUpdate(prevProps) {
    const {
      userId,
      tag,
      fetchUserBookmarkIllusts,
      clearUserBookmarkIllusts,
    } = this.props;
    const { userId: prevUserId, tag: prevTag } = prevProps;
    if (userId !== prevUserId || tag !== prevTag) {
      clearUserBookmarkIllusts(userId);
      fetchUserBookmarkIllusts(userId, tag);
    }
  }

  loadMoreItems = () => {
    const {
      userBookmarkIllusts,
      tag,
      userId,
      fetchUserBookmarkIllusts,
    } = this.props;
    if (
      userBookmarkIllusts &&
      !userBookmarkIllusts.loading &&
      userBookmarkIllusts.nextUrl
    ) {
      fetchUserBookmarkIllusts(userId, tag, userBookmarkIllusts.nextUrl);
    }
  };

  handleOnRefresh = () => {
    const {
      userId,
      tag,
      clearUserBookmarkIllusts,
      fetchUserBookmarkIllusts,
    } = this.props;
    clearUserBookmarkIllusts(userId);
    fetchUserBookmarkIllusts(userId, tag, null, true);
  };

  render() {
    const { userBookmarkIllusts, items, listKey } = this.props;
    return (
      <IllustList
        data={{ ...userBookmarkIllusts, items }}
        listKey={listKey}
        loadMoreItems={this.loadMoreItems}
        onRefresh={this.handleOnRefresh}
      />
    );
  }
}

export default connect(() => {
  const getUserBookmarkIllustsItems = makeGetUserBookmarkIllustsItems();
  return (state, props) => {
    const { userBookmarkIllusts } = state;
    const userId = props.userId || props.route.params.userId;
    return {
      userBookmarkIllusts: userBookmarkIllusts[userId],
      items: getUserBookmarkIllustsItems(state, props),
      userId,
      listKey: `${props.route.key}-userbookmarkIllusts`,
    };
  };
}, userBookmarkIllustsActionCreators)(UserBookmarkIllusts);
