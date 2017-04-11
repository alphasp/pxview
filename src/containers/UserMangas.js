import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  InteractionManager
} from 'react-native';
import { connect } from 'react-redux';
import { denormalize } from 'normalizr';
import IllustList from '../components/IllustList';
import * as userMangasActionCreators from '../common/actions/userMangas';
import Schemas from '../common/constants/schemas';

class UserMangas extends Component {
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
    const { userId, fetchUserMangas, clearUserMangas } = this.props;
    InteractionManager.runAfterInteractions(() => {
      clearUserMangas(userId);
      fetchUserMangas(userId);
    });
  }

  loadMoreItems = () => {
    const { userMangas: { nextUrl }, userId, fetchUserMangas } = this.props;
    console.log('load more ', nextUrl)
    if (nextUrl) {
      fetchUserMangas(userId, nextUrl);
    }
  }

  handleOnRefresh = () => {
    const { userId, fetchUserMangas, clearUserMangas } = this.props;
    this.setState({
      refereshing: true
    });
    clearUserMangas(userId);
    fetchUserMangas(userId).finally(() => {
      this.setState({
        refereshing: false
      }); 
    })
  }

  render() {
    const { userMangas, userId } = this.props;
    const { refreshing } = this.state;
    return (
      <IllustList
        data={userMangas}
        refreshing={refreshing}
        loadMoreItems={this.loadMoreItems}
        onRefresh={this.handleOnRefresh}
      />
    );
  }
}

const defaultItems = [];

export default connect((state, props) => {
  const { entities, userMangas } = state;
  const userId = props.userId || props.navigation.state.params.userId;
  if (userMangas[userId]) {
    const denormalizedItems = denormalize(userMangas[userId].items, Schemas.ILLUST_ARRAY, entities);
    return {
      userMangas: {
        ...userMangas[userId],
        items: denormalizedItems || defaultItems
      },
      userId
    }
  }
  else {
    return {
      userMangas: {},
      userId
    }
  }
}, userMangasActionCreators)(UserMangas);