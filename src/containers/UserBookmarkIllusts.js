import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  InteractionManager
} from 'react-native';
import { connect } from 'react-redux';
import { denormalize } from 'normalizr';
import IllustList from '../components/IllustList';
import * as userBookmarkIllustActionCreators from '../common/actions/userBookmarkIllusts';
import Schemas from '../common/constants/schemas';

class UserBookmarkIllusts extends Component {
  static navigationOptions = {
    header: ({ state, setParams, navigate, goBack }, defaultHeader) => {
      return {
        ...defaultHeader,
        backTitle: null
      }
    }
  }
  
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false
    };
  }

  componentDidMount() {
    const { userId, tag, fetchUserBookmarkIllusts, clearUserBookmarkIllusts } = this.props;
    InteractionManager.runAfterInteractions(() => {
      clearUserBookmarkIllusts(userId);
      fetchUserBookmarkIllusts(userId, tag);
    });
  }

  componentWillReceiveProps(nextProps) {
    const { userId: prevUserId, tag: prevTag } = this.props;
    const { userId, tag, fetchUserBookmarkIllusts, clearUserBookmarkIllusts } = nextProps;
    if ((userId !== prevUserId) || (tag !== prevTag)) {
      const { dataSource } = this.state;
      clearUserBookmarkIllusts(userId);
      fetchUserBookmarkIllusts(userId, tag);
    }
  }


  loadMoreItems = () => {
    const { userBookmarkIllusts, tag, userId, fetchUserBookmarkIllusts } = this.props;
    if (userBookmarkIllusts[userId] && userBookmarkIllusts[userId].nextUrl) {
      fetchUserBookmarkIllusts(userId, tag, userBookmarkIllusts[userId].nextUrl);
    }
  }

  handleOnRefresh = () => {
    const { userId, tag, clearUserBookmarkIllusts, fetchUserBookmarkIllusts } = this.props;
    this.setState({
      refereshing: true
    });
    clearUserBookmarkIllusts(userId);
    fetchUserBookmarkIllusts(userId, tag).finally(() => {
      this.setState({
        refereshing: false
      }); 
    })
  }

  render() {
    const { userBookmarkIllusts, userId } = this.props;
    const { refreshing } = this.state;
    return (
      <IllustList
        data={userBookmarkIllusts}
        refreshing={refreshing}
        loadMoreItems={this.loadMoreItems}
        onRefresh={this.handleOnRefresh}
      />
    );
  }
}

const defaultItems = [];

export default connect((state, props) => {
  const { entities, userBookmarkIllusts } = state;
  const userId = props.userId || props.navigation.state.params.userId;
  if (userBookmarkIllusts[userId]) {
    const denormalizedItems = denormalize(userBookmarkIllusts[userId].items, Schemas.ILLUST_ARRAY, entities);
    return {
      userBookmarkIllusts: {
        ...userBookmarkIllusts[userId],
        items: denormalizedItems || defaultItems
      },
      userId
    }
  }
  else {
    return {
      userBookmarkIllusts: {},
      userId
    }
  }
}, userBookmarkIllustActionCreators)(UserBookmarkIllusts);