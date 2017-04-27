import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  InteractionManager
} from 'react-native';
import { connect } from 'react-redux';
import IllustList from '../components/IllustList';
import * as userMangasActionCreators from '../common/actions/userMangas';
import { makeGetUserMangasItems } from '../common/selectors';

class UserMangas extends Component {
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
    const { userMangas, items, userId } = this.props;
    return (
      <IllustList
        data={{...userMangas, items}}
        loadMoreItems={this.loadMoreItems}
        onRefresh={this.handleOnRefresh}
      />
    );
  }
}

export default connect(() => {
  const getUserMangasItems = makeGetUserMangasItems();
  return (state, props) => {
    const { userMangas } = state;
    const userId = props.userId || props.navigation.state.params.userId;
    return {
      userMangas: userMangas[userId],
      items: getUserMangasItems(state, props),
      userId
    }
  }
}, userMangasActionCreators)(UserMangas);