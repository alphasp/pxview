import React, { Component } from 'react';
import { InteractionManager } from 'react-native';
import { connect } from 'react-redux';
import UserListContainer from './UserListContainer';
import * as searchUsersActionCreators from '../common/actions/searchUsers';
import { makeGetSearchUsersItems } from '../common/selectors';

class SearchUsersResult extends Component {
  componentDidMount() {
    const {
      navigationStateKey,
      fetchSearchUsers,
      clearSearchUsers,
      word,
    } = this.props;
    clearSearchUsers(navigationStateKey);
    InteractionManager.runAfterInteractions(() => {
      fetchSearchUsers(navigationStateKey, word);
    });
  }

  componentWillReceiveProps(nextProps) {
    const { word: prevWord } = this.props;
    const {
      navigationStateKey,
      fetchSearchUsers,
      clearSearchUsers,
      word,
    } = nextProps;
    if (word !== prevWord) {
      clearSearchUsers(navigationStateKey);
      fetchSearchUsers(navigationStateKey, word);
    }
  }

  loadMoreItems = () => {
    const {
      navigationStateKey,
      fetchSearchUsers,
      searchUsers: { nextUrl, loading },
      word,
    } = this.props;
    if (!loading && nextUrl) {
      console.log('load more ', nextUrl);
      fetchSearchUsers(navigationStateKey, word, nextUrl);
    }
  };

  handleOnRefresh = () => {
    const {
      navigationStateKey,
      fetchSearchUsers,
      clearSearchUsers,
      word,
    } = this.props;
    clearSearchUsers(navigationStateKey);
    fetchSearchUsers(navigationStateKey, word, null, true);
  };

  render() {
    const { searchUsers, items } = this.props;
    return (
      <UserListContainer
        userList={{ ...searchUsers, items }}
        loadMoreItems={this.loadMoreItems}
        onRefresh={this.handleOnRefresh}
      />
    );
  }
}

export default connect(() => {
  const getSearchUsersItems = makeGetSearchUsersItems();
  return (state, props) => {
    const { searchUsers } = state;
    const { navigationStateKey } = props;
    const word = props.word || props.navigation.state.params.word;
    return {
      searchUsers: searchUsers[navigationStateKey],
      items: getSearchUsersItems(state, props),
      word,
    };
  };
}, searchUsersActionCreators)(SearchUsersResult);
