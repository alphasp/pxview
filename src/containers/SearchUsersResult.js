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
import { denormalizedData } from '../common/helpers/normalizrHelper';
import Schemas from '../common/constants/schemas';

class SearchUsersResult extends Component {
  componentDidMount() {
    const { fetchSearchUsers, clearSearchUsers, word } = this.props;
    clearSearchUsers();
    InteractionManager.runAfterInteractions(() => {
      fetchSearchUsers(word);
    });
  }

  componentWillReceiveProps(nextProps) {
    const { word: prevWord } = this.props;
    const { fetchSearchUsers, clearSearchUsers, word } = nextProps;
    if (word !== prevWord) {
      clearSearchUsers();
      fetchSearchUsers(word);
    }
  }

  loadMoreItems = () => {
    const { fetchSearchUsers, searchUsers: { nextUrl, loading }, word } = this.props;
    if (!loading && nextUrl) {
      console.log('load more ', nextUrl)
      fetchSearchUsers(word, nextUrl);
    }
  }

  handleOnRefresh = () => {
    const { fetchSearchUsers, clearSearchUsers, word } = this.props;
    clearSearchUsers();
    fetchSearchUsers(word, null, true);
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
    const { searchUsers, word, screenProps } = this.props;
    return (
      <UserListContainer
        userList={searchUsers}
        loadMoreItems={this.loadMoreItems}
        onRefresh={this.handleOnRefresh}
        screenProps={screenProps}
      />
    );
  }
}

export default connect((state, props) => {
  const { entities, searchUsers } = state;
  const word = props.word || props.navigation.state.params.word;
  return {
    searchUsers: denormalizedData(searchUsers, 'items', Schemas.USER_PREVIEW_ARRAY, entities),
    word
  }
}, searchUsersActionCreators)(SearchUsersResult);