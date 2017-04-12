import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  InteractionManager
} from 'react-native';
import { connect } from 'react-redux';
import { denormalizedData } from '../common/helpers/normalizrHelper';
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

  componentDidMount() {
    const { userMangas, userId, fetchUserMangas, clearUserMangas } = this.props;
    if (!userMangas || !userMangas.items) {
      clearUserMangas(userId);
      InteractionManager.runAfterInteractions(() => {
        fetchUserMangas(userId);
      });
    }
  }

  loadMoreItems = () => {
    const { userMangas, userId, fetchUserMangas } = this.props;
    if (userMangas && !userMangas.loading && userMangas.nextUrl) {
      console.log('load more ', userMangas.nextUrl)
      fetchUserMangas(userId, userMangas.nextUrl);
    }
  }

  handleOnRefresh = () => {
    const { userId, fetchUserMangas, clearUserMangas } = this.props;
    clearUserMangas(userId);
    fetchUserMangas(userId, null, true);
  }

  render() {
    const { userMangas, userId } = this.props;
    return (
      <IllustList
        data={userMangas}
        loadMoreItems={this.loadMoreItems}
        onRefresh={this.handleOnRefresh}
      />
    );
  }
}

export default connect((state, props) => {
  const { entities, userMangas } = state;
  const userId = props.userId || props.navigation.state.params.userId;
  return {
    userMangas: denormalizedData(userMangas[userId], 'items', Schemas.ILLUST_ARRAY, entities),
    userId
  }
}, userMangasActionCreators)(UserMangas);