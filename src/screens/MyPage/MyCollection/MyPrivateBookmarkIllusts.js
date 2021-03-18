import React, { Component } from 'react';
import { connect } from 'react-redux';
import IllustList from '../../../components/IllustList';
import * as myPrivateBookmarkIllustActionCreators from '../../../common/actions/myPrivateBookmarkIllusts';
import { getMyPrivateBookmarkIllustsItems } from '../../../common/selectors';

class MyPrivateBookmarkIllusts extends Component {
  componentDidMount() {
    const {
      userId,
      tag,
      fetchMyPrivateBookmarkIllusts,
      clearMyPrivateBookmarkIllusts,
    } = this.props;
    clearMyPrivateBookmarkIllusts(userId);
    fetchMyPrivateBookmarkIllusts(userId, tag);
  }

  componentDidUpdate(prevProps) {
    const {
      userId,
      tag,
      fetchMyPrivateBookmarkIllusts,
      clearMyPrivateBookmarkIllusts,
    } = this.props;
    const { userId: prevUserId, tag: prevTag } = prevProps;
    if (userId !== prevUserId || tag !== prevTag) {
      clearMyPrivateBookmarkIllusts(userId);
      fetchMyPrivateBookmarkIllusts(userId, tag);
    }
  }

  loadMoreItems = () => {
    const {
      myPrivateBookmarkIllusts: { loading, nextUrl },
      tag,
      userId,
      fetchMyPrivateBookmarkIllusts,
    } = this.props;
    if (!loading && nextUrl) {
      fetchMyPrivateBookmarkIllusts(userId, tag, nextUrl);
    }
  };

  handleOnRefresh = () => {
    const {
      userId,
      tag,
      fetchMyPrivateBookmarkIllusts,
      clearMyPrivateBookmarkIllusts,
    } = this.props;
    clearMyPrivateBookmarkIllusts(userId);
    fetchMyPrivateBookmarkIllusts(userId, tag, null, true);
  };

  render() {
    const { myPrivateBookmarkIllusts, items, listKey } = this.props;
    return (
      <IllustList
        data={{ ...myPrivateBookmarkIllusts, items }}
        listKey={listKey}
        loadMoreItems={this.loadMoreItems}
        onRefresh={this.handleOnRefresh}
      />
    );
  }
}

export default connect((state, props) => {
  const { myPrivateBookmarkIllusts } = state;
  const userId = props.userId || props.route.params.userId;
  return {
    myPrivateBookmarkIllusts,
    items: getMyPrivateBookmarkIllustsItems(state),
    userId,
    listKey: props.route.key,
  };
}, myPrivateBookmarkIllustActionCreators)(MyPrivateBookmarkIllusts);
