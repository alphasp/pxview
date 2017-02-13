import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Dimensions,
  Platform,
  ListView,
  RecyclerViewBackedScrollView,
  RefreshControl,
} from 'react-native';
import { connect } from 'react-redux';
import debounce from 'lodash.debounce';
import { Actions, ActionConst } from 'react-native-router-flux';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import PXSearchBar from '../components/PXSearchBar';
import Header from '../components/Header';
import SearchAutoCompleteResult from '../components/SearchAutoCompleteResult';
import SearchUserAutoCompleteResult from '../components/SearchUserAutoCompleteResult';
// import { fetchSearchAutoComplete, clearSearchAutoComplete } from '../common/actions/searchAutoComplete';
// import { fetchSearchUserAutoComplete, clearSearchUserAutoComplete } from '../common/actions/searchUserAutoComplete';
// import { addSearchHistory ,removeSearchHistory, clearSearchHistory } from '../common/actions/searchHistory';

import * as searchAutoCompleteActionCreators from '../common/actions/searchAutoComplete';
import * as searchUserAutoCompleteActionCreators from '../common/actions/searchUserAutoComplete';
import * as searchHistoryActionCreators from '../common/actions/searchHistory';
import { SearchType } from '../common/actions/searchType';

const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : 0;

const styles = StyleSheet.create({
  container:{
    position: 'absolute',
    top: 0,
    //top: APPBAR_HEIGHT + STATUSBAR_HEIGHT,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    backgroundColor: '#fff'
  }
});

class Search2 extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // const { dispatch, word, isRenderPlaceHolder, searchType } = this.props;
    const { searchType, clearSearchUserAutoComplete, clearSearchAutoComplete } = this.props;
    if (searchType === SearchType.USER) {
      clearSearchUserAutoComplete();
    }
    else {
      clearSearchAutoComplete();
    }
  }

  handleOnChangeSearchText = (word, searchType) => {
    const { fetchSearchAutoComplete, clearSearchAutoComplete, fetchSearchUserAutoComplete, clearSearchUserAutoComplete } = this.props;
    if (searchType === SearchType.USER) {
      clearSearchUserAutoComplete();
      if (word.length > 1) {
        fetchSearchUserAutoComplete(word);
      }
    }
    else {
      clearSearchAutoComplete();
      if (word.length > 1) {
        fetchSearchAutoComplete(word);
      }
    }
  }

  submitSearch = (word, searchType)  => {
    word = word.trim();
    if (word) {
      const { navigation: { navigate, setParams }, isPushNewSearch } = this.props;
      if (searchType === SearchType.USER) {
        // Actions.searchUserResult({ word: word, type: ActionConst.REPLACE });
      }
      else {
        if (isPushNewSearch) {
          navigate('SearchResult', { word });
        }
        setTimeout(() => {
          setParams({
            isFocusSearchBar: false,
            word
          });
        }, 0);
      }
    }
  }

  // handleOnSubmitSearch = (word) => {
  //   word = word.trim();
  //   if (word) {
  //     const { navigation, searchType, isPopAndReplaceOnSubmit } = this.props;
  //     const { navigate, goBack, setParams } = navigation;
  //     console.log('navigation ', navigation)
  //     goBack(null);
  //     if (isPopAndReplaceOnSubmit) {
  //       setTimeout(() => setParams({ word }), 0)
  //       //setTimeout(() => Actions.pop(), 0);
  //     }
  //     else {
  //       if (searchType === SearchType.USER) {
  //        // Actions.searchUserResult({ word: word, type: ActionConst.REPLACE });
  //       }
  //       else {
  //         // const navigationAction = NavigationActions.replace({
  //         //   routeName: 'SearchResult',
  //         //   params: { word },
  //         // })
  //         // setTimeout(() => this.props.navigation.dispatch(navigationAction), 0);


  //         setTimeout(() => navigate('SearchResult', { word }), 0)
  //         //Actions.searchResult({ word: word, type: ActionConst.REPLACE });
  //       }
  //     }
  //    //dispatch(addSearchHistory(word));
  //   }
  // }

  handleOnPressAutoCompleteItem = (word) => {
    this.submitSearch(word);
  }

  handleOnPressSearchHistoryItem = (word) => {
    this.submitSearch(word);
  }

  handleOnPressUser = (userId) => {
    const { navigate } = this.props.navigation;
    navigate('UserDetail', { userId });
  }

  handleOnPressRemoveTag = (index) => {
    const { onSubmitSearch, word } = this.props;
    const newWord = word.split(' ').slice(index, 1).join(' ');
    if (newWord) {
      const { onSubmitSearch } = this.props;
      submitSearch(word);
    }
    else {
      Actions.pop();
    }
  }

  handleOnPressRemoveSearchHistoryItem = (item) => {
    const { removeSearchHistory } = this.props;
    removeSearchHistory(item);
  }

  handleOnPressClearSearchHistory = () => {
    const { clearSearchHistory } = this.props;
    clearSearchHistory();
  }

  loadMoreUsers = () => {
    const { fetchSearchUserAutoComplete, searchUserAutoComplete: { nextUrl } } = this.props;
    if (nextUrl) {
      fetchSearchUserAutoComplete("", nextUrl);
    }
  }

  render() {
    const { searchType, searchAutoComplete, searchUserAutoComplete, searchHistory } = this.props;
    return (
      <View style={styles.container}>
        <ScrollableTabView>
          <SearchAutoCompleteResult 
            tabLabel="Illust/Manga"
            searchAutoComplete={searchAutoComplete}
            searchHistory={searchHistory}
            onPressItem={this.handleOnPressAutoCompleteItem}
            onPressSearchHistoryItem={this.handleOnPressSearchHistoryItem}
            onPressRemoveSearchHistoryItem={this.handleOnPressRemoveSearchHistoryItem}
            onPressClearSearchHistory={this.handleOnPressClearSearchHistory}
          />
          <SearchUserAutoCompleteResult 
            tabLabel="User"
            searchUserAutoComplete={searchUserAutoComplete}
            searchHistory={searchHistory}
            onPressItem={this.handleOnPressUser}
            onPressSearchHistoryItem={this.handleOnPressSearchHistoryItem}
            onPressRemoveSearchHistoryItem={this.handleOnPressRemoveSearchHistoryItem}
            onPressClearSearchHistory={this.handleOnPressClearSearchHistory}
            loadMoreItems={this.loadMoreUsers}
          />
        </ScrollableTabView>
      </View>
    );
  }
}

export default connect((state, props) => {
  const { word, searchType, isPopAndReplaceOnSubmit } = props;
  return {
    searchAutoComplete: state.searchAutoComplete,
    searchUserAutoComplete: state.searchUserAutoComplete,
    searchHistory: state.searchHistory,
    searchType: searchType || state.searchType.type,
    word,
    isPopAndReplaceOnSubmit 
  }
}, { 
  ...searchAutoCompleteActionCreators, 
  ...searchUserAutoCompleteActionCreators, 
  ...searchHistoryActionCreators, 
})(Search2);