import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  InteractionManager
} from 'react-native';
import { connect } from 'react-redux';
import { denormalize } from 'normalizr';
import IllustList from '../components/IllustList';
import * as userIllustActionCreators from '../common/actions/userIllust';
import Schemas from '../common/constants/schemas';

class UserIllust extends Component {
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
    const { userIllust, userId, fetchUserIllusts } = this.props;
    console.log('next url ', userIllust)
    if (userIllust && userIllust.nextUrl) {
      fetchUserIllusts(userId, userIllust.nextUrl);
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
    const { userIllust, userId } = this.props;
    const { refreshing } = this.state;
    return (
      <IllustList
        data={userIllust}
        refreshing={refreshing}
        loadMoreItems={this.loadMoreItems}
        onRefresh={this.handleOnRefresh}
      />
    );
  }
}

const defaultItems = [];

export default connect((state, props) => {
  const { entities, userIllust } = state;
  const userId = props.userId || props.navigation.state.params.userId;
  if (userIllust[userId]) {
    const denormalizedItems = denormalize(userIllust[userId].items, Schemas.ILLUST_ARRAY, entities);
    return {
      userIllust: {
        ...userIllust[userId],
        items: denormalizedItems || defaultItems
      },
      userId
    }
  }
  else {
    return {
      userIllust: {},
      userId
    }
  }
}, userIllustActionCreators)(UserIllust);