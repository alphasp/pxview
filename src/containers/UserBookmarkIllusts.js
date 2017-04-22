import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  InteractionManager
} from 'react-native';
import { connect } from 'react-redux';
import { denormalizedData } from '../common/helpers/normalizrHelper';
import IllustList from '../components/IllustList';
import * as userBookmarkIllustActionCreators from '../common/actions/userBookmarkIllusts';
import Schemas from '../common/constants/schemas';

class UserBookmarkIllusts extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerBackTitle: null
    }
  }
  
  componentDidMount() {
    const { userBookmarkIllusts, userId, tag, reload, fetchUserBookmarkIllusts, clearUserBookmarkIllusts } = this.props;
    console.log('tag ', tag)
    if (!userBookmarkIllusts || !userBookmarkIllusts.items || reload) {
      clearUserBookmarkIllusts(userId);
      InteractionManager.runAfterInteractions(() => {
        fetchUserBookmarkIllusts(userId, tag);
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { userId: prevUserId, tag: prevTag } = this.props;
    const { userId, tag, fetchUserBookmarkIllusts, clearUserBookmarkIllusts } = nextProps;
    if ((userId !== prevUserId) || (tag !== prevTag)) {
      clearUserBookmarkIllusts(userId);
      fetchUserBookmarkIllusts(userId, tag);
    }
  }


  loadMoreItems = () => {
    const { userBookmarkIllusts, tag, userId, fetchUserBookmarkIllusts } = this.props;
    if (userBookmarkIllusts && !userBookmarkIllusts.loading && userBookmarkIllusts.nextUrl) {
      console.log('next url ', userBookmarkIllusts.nextUrl)
      fetchUserBookmarkIllusts(userId, tag, userBookmarkIllusts.nextUrl);
    }
  }

  handleOnRefresh = () => {
    const { userId, tag, clearUserBookmarkIllusts, fetchUserBookmarkIllusts } = this.props;
    clearUserBookmarkIllusts(userId);
    fetchUserBookmarkIllusts(userId, tag, null, true);
  }

  render() {
    const { userBookmarkIllusts, userId } = this.props;
    return (
      <IllustList
        data={userBookmarkIllusts}
        loadMoreItems={this.loadMoreItems}
        onRefresh={this.handleOnRefresh}
      />
    );
  }
}

export default connect((state, props) => {
  const { entities, userBookmarkIllusts } = state;
  const userId = props.userId || props.navigation.state.params.userId;
  return {
    userBookmarkIllusts: denormalizedData(userBookmarkIllusts[userId], 'items', Schemas.ILLUST_ARRAY, entities),
    userId
  }
}, userBookmarkIllustActionCreators)(UserBookmarkIllusts);