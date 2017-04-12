import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Dimensions,
  RecyclerViewBackedScrollView,
  RefreshControl,
} from 'react-native';
import { connect } from 'react-redux';
import IllustList from '../components/IllustList';
import * as myPrivateBookmarkIllustActionCreators from '../common/actions/myPrivateBookmarkIllusts';
import { denormalizedData } from '../common/helpers/normalizrHelper';
import Schemas from '../common/constants/schemas';

class MyPrivateBookmarkIllusts extends Component {
  componentDidMount() {
    const { userId, tag, fetchMyPrivateBookmarkIllusts, clearMyPrivateBookmarkIllusts } = this.props;
    clearMyPrivateBookmarkIllusts(userId);
    fetchMyPrivateBookmarkIllusts(userId, tag);
  }

  componentWillReceiveProps(nextProps) {
    const { userId: prevUserId, tag: prevTag } = this.props;
    const { userId, tag, fetchMyPrivateBookmarkIllusts, clearMyPrivateBookmarkIllusts } = nextProps;
    if ((userId !== prevUserId) || (tag !== prevTag)) {
      clearMyPrivateBookmarkIllusts(userId);
      fetchMyPrivateBookmarkIllusts(userId, tag);
    }
  }


  loadMoreItems = () => {
    const { myPrivateBookmarkIllusts, tag, userId, fetchMyPrivateBookmarkIllusts } = this.props;
    if (myPrivateBookmarkIllusts && !myPrivateBookmarkIllusts.loading && myPrivateBookmarkIllusts.nextUrl) {
      console.log('next url ', myPrivateBookmarkIllusts.nextUrl)
      fetchMyPrivateBookmarkIllusts(userId, tag, nextUrl);
    }
  }

  handleOnRefresh = () => {
    const { userId, tag, fetchMyPrivateBookmarkIllusts, clearMyPrivateBookmarkIllusts } = this.props;
    clearMyPrivateBookmarkIllusts(userId);
    fetchMyPrivateBookmarkIllusts(userId, tag, null, true);
  }

  render() {
    const { myPrivateBookmarkIllusts } = this.props;
    return (
      <IllustList
        data={myPrivateBookmarkIllusts}
        loadMoreItems={this.loadMoreItems}
        onRefresh={this.handleOnRefresh}
      />
    );
  }
}

export default connect((state, props) => {
  const { entities, myPrivateBookmarkIllusts } = state;
  const userId = props.userId || props.navigation.state.params.userId;
  return {
    myPrivateBookmarkIllusts: denormalizedData(myPrivateBookmarkIllusts, 'items', Schemas.ILLUST_ARRAY, entities),
    userId
  }
}, myPrivateBookmarkIllustActionCreators)(MyPrivateBookmarkIllusts);