import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  InteractionManager
} from 'react-native';
import { connect } from 'react-redux';
import { denormalize } from 'normalizr';
import IllustList from '../components/IllustList';
import * as userBookmarkIllustActionCreators from '../common/actions/userBookmarkIllust';
import Schemas from '../common/constants/schemas';

class UserBookmarkIllust extends Component {
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
    const { userBookmarkIllust, tag, userId, fetchUserBookmarkIllusts } = this.props;
    if (userBookmarkIllust[userId] && userBookmarkIllust[userId].nextUrl) {
      fetchUserBookmarkIllusts(userId, tag, userBookmarkIllust[userId].nextUrl);
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
    const { userBookmarkIllust, userId } = this.props;
    const { refreshing } = this.state;
    return (
      <IllustList
        data={userBookmarkIllust}
        refreshing={refreshing}
        loadMoreItems={this.loadMoreItems}
        onRefresh={this.handleOnRefresh}
      />
    );
  }
}

const defaultItems = [];

export default connect((state, props) => {
  const { entities, userBookmarkIllust } = state;
  const userId = props.userId || props.navigation.state.params.userId;
  if (userBookmarkIllust[userId]) {
    const denormalizedItems = denormalize(userBookmarkIllust[userId].items, Schemas.ILLUST_ARRAY, entities);
    return {
      userBookmarkIllust: {
        ...userBookmarkIllust[userId],
        items: denormalizedItems || defaultItems
      },
      userId
    }
  }
  else {
    return {
      userBookmarkIllust: {},
      userId
    }
  }
}, userBookmarkIllustActionCreators)(UserBookmarkIllust);