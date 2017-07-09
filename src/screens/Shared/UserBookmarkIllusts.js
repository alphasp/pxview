import React, { Component } from 'react';
import { InteractionManager } from 'react-native';
import { connect } from 'react-redux';
import IllustList from '../../components/IllustList';
import * as userBookmarkIllustActionCreators from '../../common/actions/userBookmarkIllusts';
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

  componentWillReceiveProps(nextProps) {
    const { userId: prevUserId, tag: prevTag } = this.props;
    const {
      userId,
      tag,
      fetchUserBookmarkIllusts,
      clearUserBookmarkIllusts,
    } = nextProps;
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
    const { userBookmarkIllusts, items } = this.props;
    return (
      <IllustList
        data={{ ...userBookmarkIllusts, items }}
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
    const userId = props.userId || props.navigation.state.params.userId;
    return {
      userBookmarkIllusts: userBookmarkIllusts[userId],
      items: getUserBookmarkIllustsItems(state, props),
      userId,
    };
  };
}, userBookmarkIllustActionCreators)(UserBookmarkIllusts);
