import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  InteractionManager
} from 'react-native';
import { connect } from 'react-redux';
import { denormalizedData } from '../common/helpers/normalizrHelper';
import IllustList from '../components/IllustList';
import * as userIllustsActionCreators from '../common/actions/userIllusts';
import Schemas from '../common/constants/schemas';

class UserIllusts extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerBackTitle: null
    }
  };

  componentDidMount() {
    const { userIllusts, userId, fetchUserIllusts, clearUserIllusts } = this.props;
    if (!userIllusts || !userIllusts.items) {
      clearUserIllusts(userId);
      InteractionManager.runAfterInteractions(() => {
        fetchUserIllusts(userId);
      });
    }
  }

  loadMoreItems = () => {
    const { userIllusts, userId, fetchUserIllusts } = this.props;
    if (userIllusts && !userIllusts.loading && userIllusts.nextUrl) {
      console.log('next url ', userIllusts)
      fetchUserIllusts(userId, userIllusts.nextUrl);
    }
  }

  handleOnRefresh = () => {
    const { userId, fetchUserIllusts, clearUserIllusts } = this.props;
    clearUserIllusts(userId);
    fetchUserIllusts(userId, null, true);
  }

  render() {
    const { userIllusts, userId } = this.props;
    return (
      <IllustList
        data={userIllusts}
        loadMoreItems={this.loadMoreItems}
        onRefresh={this.handleOnRefresh}
      />
    );
  }
}

export default connect((state, props) => {
  const { entities, userIllusts } = state;
  const userId = props.userId || props.navigation.state.params.userId;
  return {
    userIllusts: denormalizedData(userIllusts[userId], 'items', Schemas.ILLUST_ARRAY, entities),
    userId
  }
}, userIllustsActionCreators)(UserIllusts);