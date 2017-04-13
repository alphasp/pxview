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
import ScrollableTabView from 'react-native-scrollable-tab-view';
import PXSearchBar from '../components/PXSearchBar';
import Header from '../components/Header';
import SearchAutoCompleteResult from '../components/SearchAutoCompleteResult';
import SearchUsersAutoCompleteResult from '../components/SearchUsersAutoCompleteResult';
// import { fetchSearchAutoComplete, clearSearchAutoComplete } from '../common/actions/searchAutoComplete';
// import { fetchSearchUserAutoComplete, clearSearchUserAutoComplete } from '../common/actions/searchUsersAutoComplete';
// import { addSearchHistory ,removeSearchHistory, clearSearchHistory } from '../common/actions/searchHistory';

import * as searchAutoCompleteActionCreators from '../common/actions/searchAutoComplete';
import * as searchUserAutoCompleteActionCreators from '../common/actions/searchUsersAutoComplete';
import * as searchHistoryActionCreators from '../common/actions/searchHistory';
import { SearchType } from '../common/actions/searchType';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

// handleOnSubmitSearch = (word) => {
//   word = word.trim();
//   if (word) {
//     const { dispatch, searchType, isPopAndReplaceOnSubmit } = this.props;
//     if (isPopAndReplaceOnSubmit) {
//       Actions.pop();
//       setTimeout(() => Actions.refresh({ word: word, type: ActionConst.REPLACE }), 0)
//       //setTimeout(() => Actions.pop(), 0);
//     }
//     else {
//       if (searchType === SearchType.USER) {
//         Actions.searchUserResult({ word: word, type: ActionConst.REPLACE });
//       }
//       else {
//         Actions.searchResult({ word: word, type: ActionConst.REPLACE });
//       }
//     }
//     //dispatch(addSearchHistory(word));
//   }
// }

class Search extends Component {
  static navigationOptions = {
    header: (props, defaultHeader) => {
      const { state, setParams, navigate, goBack, dispatch } = props;
      const { word, searchOptions, isRenderPlaceHolder, onChangeSearchText, onSubmitSearch } = state.params;
      return {
        ...defaultHeader,
        title: (
          <PXSearchBar 
            enableBack={true} 
            isRenderPlaceHolder={true}
            autoFocus={true} 
            onChangeText={onChangeSearchText && debounce(onChangeSearchText, 300)}
            onSubmitEditing={onSubmitSearch}
            isRenderPlaceHolder={false}
            searchType={SearchType.ILLUST}
            word={word}
          />
        ),
      }
    }
  }

  constructor(props) {
    super(props);
    // this.state = {
    //   isShowSearchHistories: true
    // };
  }

  componentDidMount() {
    // const { dispatch, word, isRenderPlaceHolder, searchType } = this.props;
    const { 
      navigation, 
      fetchSearchAutoComplete, clearSearchAutoComplete, 
      fetchSearchUserAutoComplete, clearSearchUserAutoComplete,
      addSearchHistory, removeSearchHistory, clearSearchHistory 
    } = this.props;
    const { setParams } = navigation;
    const { word, isRenderPlaceHolder, searchType } = navigation.state.params;
    /*Actions.refresh({
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
    });  */
    if (searchType === SearchType.USER) {
      clearSearchUserAutoComplete();
    }
    else {
      clearSearchAutoComplete();
    }  
    setParams({
      onChangeSearchText: this.handleOnChangeSearchText,
      onSubmitSearch: this.handleOnSubmitSearch
    });    
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

  handleOnSubmitSearch = (word) => {
    word = word.trim();
    if (word) {
      const { navigation, searchType, isPopAndReplaceOnSubmit } = this.props;
      const { navigate, goBack, setParams } = navigation;
      console.log('navigation ', navigation)
      goBack(null);
      if (isPopAndReplaceOnSubmit) {
        setTimeout(() => setParams({ word }), 0)
        //setTimeout(() => Actions.pop(), 0);
      }
      else {
        if (searchType === SearchType.USER) {
         // Actions.searchUserResult({ word: word, type: ActionConst.REPLACE });
        }
        else {
          // const navigationAction = NavigationActions.replace({
          //   routeName: 'SearchResult',
          //   params: { word },
          // })
          // setTimeout(() => this.props.navigation.dispatch(navigationAction), 0);


          setTimeout(() => navigate('SearchResult', { word }), 0)
          //Actions.searchResult({ word: word, type: ActionConst.REPLACE });
        }
      }
     //dispatch(addSearchHistory(word));
    }
  }

  handleOnPressAutoCompleteItem = (word) => {
    this.handleOnSubmitSearch(word);
  }

  handleOnPressSearchHistoryItem = (word) => {
    this.handleOnSubmitSearch(word);
  }

  handleOnPressUser = (userId) => {
    //Actions.userDetail({ userId: userId });
  }

  handleOnPressRemoveTag = (index) => {
    const { word } = this.props;
    const newWord = word.split(' ').slice(index, 1).join(' ');
    if (newWord) {
      this.handleOnSubmitSearch(newWord);
    }
    else {
      //Actions.pop();
    }
  }

  handleOnPressRemoveSearchHistoryItem = (item) => {
    const { dispatch } = this.props;
    dispatch(removeSearchHistory(item));
  }

  handleOnPressClearSearchHistory = () => {
    const { dispatch } = this.props;
    dispatch(clearSearchHistory());
  }

  loadMoreUsers = () => {
    const { dispatch, searchUsersAutoComplete: { nextUrl } } = this.props;
    if (nextUrl) {
      dispatch(fetchSearchUserAutoComplete("", nextUrl));
    }
  }

  render() {
    const { searchType, searchAutoComplete, searchUsersAutoComplete, searchHistory } = this.props;
    return (
      <View style={styles.container}>
        {
          searchType  === SearchType.USER ?
          <SearchUsersAutoCompleteResult 
            searchUsersAutoComplete={searchUsersAutoComplete}
            searchHistory={searchHistory}
            onPressItem={this.handleOnPressUser}
            onPressSearchHistoryItem={this.handleOnPressSearchHistoryItem}
            onPressRemoveSearchHistoryItem={this.handleOnPressRemoveSearchHistoryItem}
            onPressClearSearchHistory={this.handleOnPressClearSearchHistory}
            loadMoreItems={this.loadMoreUsers}
          />
          :
          <SearchAutoCompleteResult 
            searchAutoComplete={searchAutoComplete}
            searchHistory={searchHistory}
            onPressItem={this.handleOnPressAutoCompleteItem}
            onPressSearchHistoryItem={this.handleOnPressSearchHistoryItem}
            onPressRemoveSearchHistoryItem={this.handleOnPressRemoveSearchHistoryItem}
            onPressClearSearchHistory={this.handleOnPressClearSearchHistory}
          />
        }
      </View>
    );
  }
}

export default connect((state, props) => {
  const { word, searchType, isPopAndReplaceOnSubmit } = props;
  return {
    searchAutoComplete: state.searchAutoComplete,
    searchUsersAutoComplete: state.searchUsersAutoComplete,
    searchHistory: state.searchHistory,
    searchType: searchType || state.searchType.type,
    word,
    isPopAndReplaceOnSubmit 
  }
}, { 
  ...searchAutoCompleteActionCreators, 
  ...searchUserAutoCompleteActionCreators, 
  ...searchHistoryActionCreators, 
})(Search);