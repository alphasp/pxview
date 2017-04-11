import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  InteractionManager
} from 'react-native';
import { connect } from 'react-redux';
import { denormalize } from 'normalizr';
import IllustList from '../components/IllustList';
import * as userIllustsActionCreators from '../common/actions/userIllusts';
import Schemas from '../common/constants/schemas';

class UserIllusts extends Component {
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
    const { userId, fetchUserIllusts, clearUserIllusts } = this.props;
    InteractionManager.runAfterInteractions(() => {
      clearUserIllusts(userId);
      fetchUserIllusts(userId);
    });
  }

  loadMoreItems = () => {
    const { userIllusts, userId, fetchUserIllusts } = this.props;
    console.log('next url ', userIllusts)
    if (userIllusts && userIllusts.nextUrl) {
      fetchUserIllusts(userId, userIllusts.nextUrl);
    }
  }

  handleOnRefresh = () => {
    const { userId, fetchUserIllusts, clearUserIllusts } = this.props;
    this.setState({
      refereshing: true
    });
    clearUserIllusts(userId);
    fetchUserIllusts(userId).finally(() => {
      this.setState({
        refereshing: false
      }); 
    })
  }

  render() {
    const { userIllusts, userId } = this.props;
    const { refreshing } = this.state;
    return (
      <IllustList
        data={userIllusts}
        refreshing={refreshing}
        loadMoreItems={this.loadMoreItems}
        onRefresh={this.handleOnRefresh}
      />
    );
  }
}

const defaultItems = [];

export default connect((state, props) => {
  const { entities, userIllusts } = state;
  const userId = props.userId || props.navigation.state.params.userId;
  if (userIllusts[userId]) {
    const denormalizedItems = denormalize(userIllusts[userId].items, Schemas.ILLUST_ARRAY, entities);
    return {
      userIllusts: {
        ...userIllusts[userId],
        items: denormalizedItems || defaultItems
      },
      userId
    }
  }
  else {
    return {
      userIllusts: {},
      userId
    }
  }
}, userIllustsActionCreators)(UserIllusts);