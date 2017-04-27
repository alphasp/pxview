import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Dimensions,
  RecyclerViewBackedScrollView,
  RefreshControl,
  InteractionManager,
} from 'react-native';
import { connect } from 'react-redux';
import RecommendedUsers from './RecommendedUsers';
import SearchBar from '../components/SearchBar';
import Header from '../components/Header';
import UserListContainer from './UserListContainer';
import * as searchUsersActionCreators from '../common/actions/searchUsers';
import { SearchType } from '../common/actions/searchType';
import { makeGetSearchUsersItems } from '../common/selectors';

class SearchUsersResult extends Component {
  componentDidMount() {
    const { navigationStateKey, fetchSearchUsers, clearSearchUsers, word } = this.props;
    clearSearchUsers(navigationStateKey);
    InteractionManager.runAfterInteractions(() => {
      fetchSearchUsers(navigationStateKey, word);
    });
  }

  componentWillReceiveProps(nextProps) {
    const { word: prevWord } = this.props;
    const { navigationStateKey, fetchSearchUsers, clearSearchUsers, word } = nextProps;
    if (word !== prevWord) {
      clearSearchUsers(navigationStateKey);
      fetchSearchUsers(navigationStateKey, word);
    }
  }

  loadMoreItems = () => {
    const { navigationStateKey, fetchSearchUsers, searchUsers: { nextUrl, loading }, word } = this.props;
    if (!loading && nextUrl) {
      console.log('load more ', nextUrl)
      fetchSearchUsers(navigationStateKey, word, nextUrl);
    }
  }

  handleOnRefresh = () => {
    const { navigationStateKey, fetchSearchUsers, clearSearchUsers, word } = this.props;
    clearSearchUsers(navigationStateKey);
    fetchSearchUsers(navigationStateKey, word, null, true);
  }

  // handleOnPressRemoveTag = (index) => {
  //   const { dispatch, word } = this.props;
  //   const newWord = word.split(' ').filter((value, i) => {
  //     return i !== index;
  //   }).join(' ');
  //   console.log('new word ', newWord);
  //   if (newWord) {
  //     clearSearchUsers();
  //     fetchSearchUsers(newWord);
  //     /*Actions.refresh({
  //       word: newWord,
  //       renderTitle: () => {
  //         return (
  //           <SearchBar 
  //             enableBack={true} 
  //             onFocus={this.handleOnSearchFieldFocus} 
  //             onPressRemoveTag={this.handleOnPressRemoveTag}
  //             isRenderPlaceHolder={true}
  //             searchType={SearchType.USER}
  //             word={newWord}
  //           />
  //         )
  //       }
  //     });*/
  //   }
  //   else {
  //     //Actions.pop();
  //   }
  // }

  render() {
    const { searchUsers, items, word, screenProps } = this.props;
    return (
      <UserListContainer
        userList={{...searchUsers, items}}
        loadMoreItems={this.loadMoreItems}
        onRefresh={this.handleOnRefresh}
        screenProps={screenProps}
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
      word
    }
  }
}, searchUsersActionCreators)(SearchUsersResult);