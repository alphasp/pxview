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
import { fetchSearchUserAutoComplete, clearSearchUserAutoComplete } from '../common/actions/searchUserAutoComplete';
import { addSearchHistory ,removeSearchHistory, clearSearchHistory } from '../common/actions/searchHistory';
import { SearchType } from '../common/actions/searchType';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

class Search extends Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   isShowSearchHistories: true
    // };
  }

  componentDidMount() {
    const { dispatch, word, isRenderPlaceHolder, searchType } = this.props;
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
    if (searchType === SearchType.USER) {
      dispatch(clearSearchUserAutoComplete());
    }
    else {
      dispatch(clearSearchAutoComplete());
    }         
  }

  handleOnChangeSearchText = (word, searchType) => {
    const { dispatch } = this.props;
    if (searchType === SearchType.USER) {
      dispatch(clearSearchUserAutoComplete());
      if (word.length > 1) {
        dispatch(fetchSearchUserAutoComplete(word));
      }
    }
    else {
      dispatch(clearSearchAutoComplete());
      if (word.length > 1) {
        dispatch(fetchSearchAutoComplete(word));
      }
    }
  }
  handleOnSubmitSearch = (word) => {
    word = word.trim();
    if (word) {
      const { dispatch, searchType, isPopAndReplaceOnSubmit } = this.props;
      if (isPopAndReplaceOnSubmit) {
        Actions.pop();
        setTimeout(() => Actions.refresh({ word: word, type: ActionConst.REPLACE }), 0)
        //setTimeout(() => Actions.pop(), 0);
      }
      else {
        if (searchType === SearchType.USER) {
          Actions.searchUserResult({ word: word, type: ActionConst.REPLACE });
        }
        else {
          Actions.searchResult({ word: word, type: ActionConst.REPLACE });
        }
      }
      dispatch(addSearchHistory(word));
    }
  }

  handleOnPressAutoCompleteItem = (word) => {
    this.handleOnSubmitSearch(word);
  }

  handleOnPressSearchHistoryItem = (word) => {
    this.handleOnSubmitSearch(word);
  }

  handleOnPressUser = (userId) => {
    Actions.userDetail({ userId: userId });
  }

  handleOnPressRemoveTag = (index) => {
    const { word } = this.props;
    const newWord = word.split(' ').slice(index, 1).join(' ');
    if (newWord) {
      this.handleOnSubmitSearch(newWord);
    }
    else {
      Actions.pop();
    }
  }

  handleOnPressRemoveSearchHistoryItem = (item) => {
    const { dispatch } = this.props;
    dispatch(removeSearchHistory(item));
  }

  handleOnPressRemoveClearSearchHistory = () => {
    const { dispatch } = this.props;
    dispatch(clearSearchHistory());
  }

  loadMoreUsers = () => {
    const { dispatch, searchUserAutoComplete: { nextUrl } } = this.props;
    if (nextUrl) {
      dispatch(fetchSearchUserAutoComplete("", nextUrl));
    }
  }

  render() {
    const { searchType, searchAutoComplete, searchUserAutoComplete, searchHistory } = this.props;
    return (
      <View style={styles.container}>
        {
          searchType  === SearchType.USER ?
          <SearchUserAutoCompleteResult 
            searchUserAutoComplete={searchUserAutoComplete}
            searchHistory={searchHistory}
            onPressItem={this.handleOnPressUser}
            onPressSearchHistoryItem={this.handleOnPressSearchHistoryItem}
            onPressRemoveSearchHistoryItem={this.handleOnPressRemoveSearchHistoryItem}
            onPressRemoveClearSearchHistory={this.handleOnPressRemoveClearSearchHistory}
            loadMoreItems={this.loadMoreUsers}
          />
          :
          <SearchAutoCompleteResult 
            searchAutoComplete={searchAutoComplete}
            searchHistory={searchHistory}
            onPressItem={this.handleOnPressAutoCompleteItem}
            onPressSearchHistoryItem={this.handleOnPressSearchHistoryItem}
            onPressRemoveSearchHistoryItem={this.handleOnPressRemoveSearchHistoryItem}
            onPressRemoveClearSearchHistory={this.handleOnPressRemoveClearSearchHistory}
          />
        }
      </View>
    );
  }
}

export default connect((state, { searchType }) => {
  return {
    searchAutoComplete: state.searchAutoComplete,
    searchUserAutoComplete: state.searchUserAutoComplete,
    searchHistory: state.searchHistory,
    searchType: searchType || state.searchType.type,
  }
})(Search);