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
import { denormalize } from 'normalizr';
import IllustList from '../components/IllustList';
import * as myPrivateBookmarkIllustActionCreators from '../common/actions/myPrivateBookmarkIllust';
import Schemas from '../common/constants/schemas';

class MyPrivateBookmarkIllust extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false
    };
  }

  componentDidMount() {
    const { userId, tag, fetchMyPrivateBookmarkIllusts, clearMyPrivateBookmarkIllusts } = this.props;
    clearMyPrivateBookmarkIllusts(userId);
    fetchMyPrivateBookmarkIllusts(userId, tag);
  }

  componentWillReceiveProps(nextProps) {
    const { userId: prevUserId, tag: prevTag } = this.props;
    const { userId, tag, fetchMyPrivateBookmarkIllusts, clearMyPrivateBookmarkIllusts } = nextProps;
    if ((userId !== prevUserId) || (tag !== prevTag)) {
      const { dataSource } = this.state;
      clearMyPrivateBookmarkIllusts(userId);
      fetchMyPrivateBookmarkIllusts(userId, tag);
    }
  }


  loadMoreItems = () => {
    const {  myPrivateBookmarkIllust: { nextUrl }, tag, userId, fetchMyPrivateBookmarkIllusts, clearMyPrivateBookmarkIllusts } = this.props;
    if (nextUrl) {
      fetchMyPrivateBookmarkIllusts(userId, tag, nextUrl);
    }
  }

  handleOnRefresh = () => {
    const {  userId, tag, fetchMyPrivateBookmarkIllusts, clearMyPrivateBookmarkIllusts } = this.props;
    this.setState({
      refereshing: true
    });
    clearMyPrivateBookmarkIllusts(userId);
    fetchMyPrivateBookmarkIllusts(userId, tag).finally(() => {
      this.setState({
        refereshing: false
      }); 
    });
  }

  render() {
    const { myPrivateBookmarkIllust } = this.props;
    const { refreshing } = this.state;
    return (
      <IllustList
        data={myPrivateBookmarkIllust}
        refreshing={refreshing}
        loadMoreItems={this.loadMoreItems}
        onRefresh={this.handleOnRefresh}
      />
    );
  }
}

const defaultItems = [];

export default connect((state, props) => {
  const { entities, myPrivateBookmarkIllust } = state;
  const userId = props.userId || props.navigation.state.params.userId;
  const denormalizedItems = denormalize(myPrivateBookmarkIllust.items, Schemas.ILLUST_ARRAY, entities);
  return {
    myPrivateBookmarkIllust: {
      ...myPrivateBookmarkIllust,
      items: denormalizedItems || defaultItems
    },
    userId
  }
}, myPrivateBookmarkIllustActionCreators)(MyPrivateBookmarkIllust);