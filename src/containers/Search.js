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
import debounce from 'lodash.debounce';
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
          <SearchBar 
            enableBack={true} 
            autoFocus={true} 
            onSubmitEditing={this.handleOnSubmitSearch}
            onChangeText={debounce(this.handleOnChangeSearchText, 300)}
            onPressRemoveTag={this.handleOnPressRemoveTag}
            word={word}
            isRenderPlaceHolder={isRenderPlaceHolder}
          />
        )
      }
    });           
  }

  handleOnChangeSearchText = (word, searchType) => {
    const { dispatch } = this.props;
    if (searchType === SearchType.USER) {
      dispatch(clearSearchUser());
      if (word.length > 1) {
        dispatch(fetchSearchUser(word));
      }
    }
    else {
      dispatch(clearSearchAutoComplete());
      if (word.length > 1) {
        dispatch(fetchSearchAutoComplete(word));
      }
      //show history searches
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

  handleOnPressAutoCompleteItem = (word, searchType) => {
    this.handleOnSubmitSearch(word, searchType);
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

  handleOnPressUser = (userId) => {
    Actions.userDetail({ userId: userId });
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
            onPressItem={this.handleOnPressUser}
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