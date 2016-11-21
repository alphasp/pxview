import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Dimensions,
  ListView,
  RecyclerViewBackedScrollView,
  RefreshControl,
} from 'react-native';
import { connect } from 'react-redux';
import { Actions, ActionConst } from 'react-native-router-flux';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import SearchBar from '../components/SearchBar';
import Header from '../components/Header';
import SearchAutoCompleteResult from '../components/SearchAutoCompleteResult';
import SearchUserAutoCompleteResult from '../components/SearchUserAutoCompleteResult';
import { fetchSearchAutoComplete, clearSearchAutoComplete } from '../common/actions/searchAutoComplete';
import { fetchSearchUser, clearSearchUser } from '../common/actions/searchUser';
import { SearchType } from '../common/actions/searchType';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

class Search extends Component {
  constructor(props) {
    super(props);
    const { word } = props;
  }

  componentDidMount() {
    const { word, isRenderPlaceHolder } = this.props;
    Actions.refresh({
      renderTitle: () => {
        return (
          <Header>
            <SearchBar 
              enableBack={true} 
              autoFocus={true} 
              onSubmitEditing={this.handleOnSubmitSearch}
              onChangeText={this.handleOnChangeSearchText}
              onPressRemoveTag={this.handleOnPressRemoveTag}
              word={word}
              isRenderPlaceHolder={isRenderPlaceHolder}
            />
          </Header>
        )
      }
    });           
  }

  handleOnChangeSearchText = (word, searchType) => {
    this.setState({ searchType })
    const { dispatch } = this.props;
    if (searchType === SearchType.USER) {
      if (word.length > 1) {
        dispatch(fetchSearchUser(word));
      }
      else {
        dispatch(clearSearchUser());
        //show history searches
      }
    }
    else {
      if (word.length > 1) {
        dispatch(fetchSearchAutoComplete(word));
      }
      else {
        dispatch(clearSearchAutoComplete());
        //show history searches
      }
    }
  }
  handleOnSubmitSearch = (word, searchType) => {
    word = word.trim();
    console.log('submit ', word)
    if (word) {
      if (searchType === SearchType.USER) {
        Actions.searchUserResult({ word: word, type: ActionConst.REPLACE });
      }
      else {
        Actions.searchResult({ word: word, type: ActionConst.REPLACE });
      }
    }
  }

  handleOnPressAutoCompleteItem = (word) => {
    this.handleOnSubmitSearch(word);
  }

  handleOnPressRemoveTag = (index) => {
    const { word } = this.props;
    const newWord = word.split(' ').splice(index, 1).join(' ');
    if (newWord) {
      this.handleOnSubmitSearch(newWord);
    }
    else {
      Actions.pop();
    }
  }
  loadMoreUsers = () => {
    const { dispatch, searchUser: { nextUrl } } = this.props;
    if (nextUrl) {
      dispatch(fetchSearchUser("", nextUrl));
    }
  }

  render() {
    const { searchType, searchAutoComplete, searchUser } = this.props;
    return (
      <View style={styles.container}>
        {
          searchType  === SearchType.USER ?
          <SearchUserAutoCompleteResult 
            searchUserAutoComplete={searchUser}
            onPressItem={this.handleOnPressAutoCompleteItem}
            loadMoreItems={this.loadMoreUsers}
          />
          :
          <SearchAutoCompleteResult 
            searchAutoComplete={searchAutoComplete}
            onPressItem={this.handleOnPressAutoCompleteItem}
          />
        }

      </View>
    );
  }
}

export default connect((state, { searchType }) => {
  return {
    searchAutoComplete: state.searchAutoComplete,
    searchUser: state.searchUser,
    searchType: searchType || state.searchType.type,
  }
})(Search);